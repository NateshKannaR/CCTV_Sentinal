from typing import Dict, Any

def calculate_scale_architecture(
    camera_count: int = 80000,
    fps: int = 25,
    resolution: str = "1080p",
    codec: str = "H.265",
    hot_storage_days: int = 7,
    warm_storage_days: int = 23,
    cold_storage_days: int = 60,
    edge_ai_percent: int = 80  # 80% processed at edge/regional nodes, 20% central
) -> Dict[str, Any]:
    """
    Computes infrastructure sizing for statewide deployment up to 80,000 cameras.
    """
    # Average bitrates in Mbps
    bitrates_mbps = {
        ("1080p", "H.264"): 4.0,
        ("1080p", "H.265"): 2.0,
        ("4K", "H.264"): 12.0,
        ("4K", "H.265"): 6.0,
        ("720p", "H.264"): 2.0,
        ("720p", "H.265"): 1.0,
    }

    avg_bitrate_mbps = bitrates_mbps.get((resolution, codec), 2.0)

    # 1. Total Raw Ingestion Bandwidth
    total_bandwidth_gbps = (camera_count * avg_bitrate_mbps) / 1000.0
    
    # In an edge-federated model, video is retained locally/regionally,
    # and only metadata/events (~15 Kbps per camera) are sent centrally continuously,
    # with on-demand video streaming (assuming 5% concurrent operator viewing).
    metadata_bandwidth_mbps = (camera_count * 15.0) / 1000.0 # ~1.2 Gbps for 80k cams!
    concurrent_viewing_cams = int(camera_count * 0.05) # 4,000 concurrent streams
    central_live_video_bandwidth_gbps = (concurrent_viewing_cams * avg_bitrate_mbps) / 1000.0 # ~8 Gbps

    # 2. Storage Calculations (Per camera per day in Gigabytes)
    # Bitrate (Mbps) * 3600 * 24 / 8 / 1024 / 1024 => GB per day
    gb_per_camera_day = (avg_bitrate_mbps * 1000000 * 86400) / (8 * 1024 * 1024 * 1024)

    hot_storage_pb = (camera_count * gb_per_camera_day * hot_storage_days) / (1024 * 1024)
    warm_storage_pb = (camera_count * gb_per_camera_day * warm_storage_days) / (1024 * 1024)
    cold_storage_pb = (camera_count * gb_per_camera_day * cold_storage_days) / (1024 * 1024)
    total_storage_pb = hot_storage_pb + warm_storage_pb + cold_storage_pb

    # 3. AI Compute Sizing (GPUs / NPU Nodes)
    # A modern enterprise GPU (e.g. NVIDIA L4 / T4 / A10) can process ~40-60 streams at 2-5 FPS inference sampling.
    streams_per_gpu = 45
    total_gpus_needed = int((camera_count / streams_per_gpu) * 1.15) # 15% redundancy buffer

    edge_gpus = int(total_gpus_needed * (edge_ai_percent / 100.0))
    central_gpus = total_gpus_needed - edge_gpus

    # 4. Message Bus & Ingestion Brokers (Kafka / RabbitMQ)
    # Detections per second: assuming 0.5 vehicle detections/sec/camera peak
    peak_detections_per_sec = int(camera_count * 0.5)
    kafka_brokers_needed = max(5, int(peak_detections_per_sec / 15000))

    return {
        "camera_count": camera_count,
        "resolution": resolution,
        "codec": codec,
        "avg_bitrate_mbps": avg_bitrate_mbps,
        "bandwidth": {
            "total_raw_stream_gbps": round(total_bandwidth_gbps, 1),
            "edge_metadata_stream_mbps": round(metadata_bandwidth_mbps, 1),
            "central_on_demand_video_gbps": round(central_live_video_bandwidth_gbps, 1),
            "bandwidth_saving_percentage": round((1 - (central_live_video_bandwidth_gbps / total_bandwidth_gbps)) * 100, 1)
        },
        "storage": {
            "gb_per_camera_day": round(gb_per_camera_day, 2),
            "hot_storage_tier_pb": round(hot_storage_pb, 2),
            "warm_storage_tier_pb": round(warm_storage_pb, 2),
            "cold_storage_tier_pb": round(cold_storage_pb, 2),
            "total_storage_pb": round(total_storage_pb, 2),
            "architecture": "NVMe / Ceph Hot Pool + S3-compatible Object Warm Pool + Glacier/Tape Cold Archive"
        },
        "compute": {
            "total_gpus_required": total_gpus_needed,
            "edge_regional_gpus": edge_gpus,
            "central_command_gpus": central_gpus,
            "streams_per_gpu_density": streams_per_gpu,
            "recommended_gpu_model": "NVIDIA L4 24GB or Jetson Orin at Edge Junctions"
        },
        "messaging_and_db": {
            "peak_detections_per_sec": peak_detections_per_sec,
            "kafka_brokers": kafka_brokers_needed,
            "database_cluster": "Distributed TimescaleDB + PostGIS with Read-Replicas and Milvus Vector Search"
        }
    }
