import os
import subprocess
import tempfile # Tambahkan library ini
from flask import Flask, request, send_file
from flask_cors import CORS
from werkzeug.utils import secure_filename

app = Flask(__name__)
CORS(app)

# Gunakan folder Temp sistem agar tidak memicu Live Server refresh
UPLOAD_FOLDER = os.path.join(tempfile.gettempdir(), 'tiktok_temp_uploads')
OUTPUT_FOLDER = os.path.join(tempfile.gettempdir(), 'tiktok_temp_outputs')
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(OUTPUT_FOLDER, exist_ok=True)

# ... (KODE KE BAWAHNYA TETAP SAMA SEPERTI SEBELUMNYA) ...

@app.route('/process-video', methods=['POST'])
def process_video():
    if 'video' not in request.files:
        return 'No video file part', 400
    
    file = request.files['video']
    if file.filename == '':
        return 'No selected file', 400

    # Menangkap opsi resolusi & FPS dari Javascript
    resolution = request.form.get('resolution', '1080P').upper()
    fps = request.form.get('fps', '60')

    filename = secure_filename(file.filename)
    input_path = os.path.join(UPLOAD_FOLDER, filename)
    output_filename = f"HQ_{resolution}_{fps}FPS_{filename}"
    output_path = os.path.join(OUTPUT_FOLDER, output_filename)
    
    file.save(input_path)

    # Menyesuaikan resolusi (TikTok umumnya vertikal, jadi kita patok lebar / width)
    scale_filter = "scale=1080:-2" # Default 1080P (Lebar 1080, tinggi menyesuaikan proporsi)
    if resolution == '4K':
        scale_filter = "scale=2160:-2" # 4K Vertical (Lebar 2160)
    elif resolution == '720P':
        scale_filter = "scale=720:-2"
        
    # Kalkulasi GOP Size (disarankan setengah dari FPS atau sama dengan FPS untuk TikTok)
    gop_size = str(int(fps) // 2)

    # FFmpeg Command dengan dynamic filter
    ffmpeg_cmd = [
        'ffmpeg', '-y', '-i', input_path,
        '-vf', scale_filter,   # Filter resolusi 4K/1080P
        '-c:v', 'libx264',
        '-preset', 'slow',
        '-profile:v', 'high',
        '-crf', '18',          # Lossless config
        '-r', str(fps),        # Custom FPS
        '-g', gop_size,        # Custom Binary GOP
        '-c:a', 'aac',
        '-b:a', '192k',
        output_path
    ]

    try:
        subprocess.run(ffmpeg_cmd, check=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        return send_file(output_path, as_attachment=True)
    except subprocess.CalledProcessError as e:
        return f"Error processing video: {str(e)}", 500
    finally:
        if os.path.exists(input_path):
            os.remove(input_path)

if __name__ == '__main__':
    print("TikTok HQ Engine is running and open to all IPs on Port 5000")
    # Tambahkan host='0.0.0.0' agar terbuka untuk semua IP
    app.run(host='0.0.0.0', port=5000)