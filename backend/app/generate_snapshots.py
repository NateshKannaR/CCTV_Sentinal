from PIL import Image, ImageDraw, ImageFont
from pathlib import Path
from backend.app.config import SNAPSHOTS_DIR

def generate_sample_snapshots():
    SNAPSHOTS_DIR.mkdir(parents=True, exist_ok=True)

    items = [
        ("gj01_1.jpg", "GJ01AB1234", "CAM-GN-01", "Sector 18 Gandhinagar", "WHITE SUV - TOYOTA FORTUNER", (40, 60, 90)),
        ("gj01_2.jpg", "GJ01AB1234", "CAM-GN-03", "Infocity Circle North", "WHITE SUV - TOYOTA FORTUNER", (35, 55, 80)),
        ("gj01_3.jpg", "GJ01AB1234", "CAM-AHM-01", "Vaishno Devi Circle", "WHITE SUV - TOYOTA FORTUNER", (30, 50, 75)),
        ("gj01_4.jpg", "GJ01AB1234", "CAM-AHM-02", "Gota Flyover Checkpoint", "WHITE SUV - TOYOTA FORTUNER", (32, 52, 78)),
        ("gj01_5.jpg", "GJ01AB1234", "CAM-AHM-04", "ISKCON Cross Road", "WHITE SUV - TOYOTA FORTUNER", (28, 45, 70)),
        ("gj01_6.jpg", "GJ01AB1234", "CAM-AHM-07", "Nehrunagar Circle", "WHITE SUV - TOYOTA FORTUNER", (25, 40, 65)),
        ("gj01_7.jpg", "GJ01AB1234", "CAM-AHM-10", "Narol Circle Toll Junction", "WHITE SUV - TOYOTA FORTUNER", (20, 35, 60)),
        ("bg_1.jpg", "GJ01DK5566", "CAM-AHM-03", "Thaltej Cross Road", "GREY SEDAN", (50, 50, 50)),
        ("bg_2.jpg", "GJ27EA9081", "CAM-GN-02", "Mahatma Mandir", "MOTORCYCLE", (45, 45, 50)),
        ("bg_3.jpg", "GJ05TR3344", "CAM-SUR-01", "Athwa Gate Surat", "SILVER HATCHBACK", (55, 50, 50)),
        ("bg_4.jpg", "GJ06KL1212", "CAM-VAD-01", "Alkapuri Vadodara", "GSRTC BUS", (40, 55, 45)),
        ("bg_5.jpg", "GJ03HH8989", "CAM-RAJ-01", "Trikon Baug Rajkot", "COMMERCIAL TRUCK", (50, 45, 40)),
        ("bg_6.jpg", "GJ05XY9999", "CAM-SUR-05", "Kamrej Toll Plaza", "BLACK SUV - SCORPIO (WANTED)", (80, 20, 20)),
    ]

    for filename, plate, cam_id, loc, vdesc, bg_color in items:
        img_path = SNAPSHOTS_DIR / filename
        if img_path.exists():
            continue

        width, height = 640, 360
        img = Image.new("RGB", (width, height), color=bg_color)
        draw = ImageDraw.Draw(img)

        # Draw CCTV HUD frame
        draw.rectangle([10, 10, width - 10, height - 10], outline=(0, 255, 200), width=2)
        
        # Grid crosshairs
        draw.line([width // 2 - 20, height // 2, width // 2 + 20, height // 2], fill=(0, 255, 200, 120), width=1)
        draw.line([width // 2, height // 2 - 20, width // 2, height // 2 + 20], fill=(0, 255, 200, 120), width=1)

        # Header overlay
        draw.rectangle([10, 10, width - 10, 40], fill=(10, 20, 30))
        draw.text((20, 16), f"GUJARAT POLICE SURVEILLANCE GRID | {cam_id} | {loc}", fill=(0, 255, 200))

        # Target Bounding Box
        bbox = [140, 80, 500, 290]
        draw.rectangle(bbox, outline=(255, 60, 60) if "WANTED" in vdesc or plate == "GJ01AB1234" else (0, 255, 120), width=3)
        draw.text((145, 85), f"{vdesc} [CONF: 98.4%]", fill=(255, 255, 255))

        # License Plate Banner
        plate_box = [230, 230, 410, 275]
        draw.rectangle(plate_box, fill=(255, 240, 0), outline=(0, 0, 0), width=2)
        draw.text((240, 240), f"IND  {plate}", fill=(0, 0, 0))

        # Bottom telemetry
        draw.rectangle([10, height - 35, width - 10, height - 10], fill=(10, 20, 30))
        draw.text((20, height - 30), f"PTS: MONOTONIC | CODEC: H.264/RTSP TCP | FPS: 25.0 | AI: ANPR-v4-GUJ", fill=(200, 200, 200))

        img.save(img_path, "JPEG", quality=85)

if __name__ == "__main__":
    generate_sample_snapshots()
