import math
import random

# --- CONFIGURATION ---
# Imagine a 10-meter corridor in your hostel.
# Beacon A is placed at Room 309 (x = 0 meters)
# Beacon B is placed at Room 310 (x = 10 meters)
beacons = {
    "Beacon_309": 0.0,
    "Beacon_310": 10.0
}

# BLE (Bluetooth Low Energy) Signal Constants
TX_POWER = -59           # The standard signal strength (RSSI) exactly 1 meter away from the beacon
PATH_LOSS_EXPONENT = 2.5 # How much concrete/walls block the signal (usually 2.0 to 3.0 indoors)

def calculate_rssi(actual_distance):
    """
    Simulates the physical Bluetooth radio wave traveling through the air.
    Adds real-world noise (bouncing off walls, people walking by).
    """
    if actual_distance < 0.1: 
        actual_distance = 0.1 # Prevent math errors when standing exactly on the beacon
        
    # Standard Radio Frequency math formula for signal decay over distance
    rssi = TX_POWER - (10 * PATH_LOSS_EXPONENT * math.log10(actual_distance))
    
    # Real world Bluetooth signals bounce and fluctuate (Signal Noise)
    noise = random.uniform(-4.0, 4.0) 
    return round(rssi + noise, 2)

def estimate_distance(rssi):
    """
    This is the code that runs ON THE STUDENT'S PHONE.
    It takes the raw signal strength (-75 dBm) and guesses how far away the beacon is.
    """
    # Inverse formula: Distance = 10 ^ ((TxPower - RSSI) / (10 * n))
    distance = 10 ** ((TX_POWER - rssi) / (10 * PATH_LOSS_EXPONENT))
    return round(distance, 2)

print("=========================================================")
print("BLE INDOOR POSITIONING SIMULATOR (Hostel Corridor)")
print("=========================================================\n")
print("A student is walking from Room 309 to Room 310.\n")

# Simulate the student walking from 0 meters to 10 meters in steps of 2 meters
student_x = 0.0
while student_x <= 10.0:
    print(f"Student is actually at: {student_x} meters down the hall")
    print("-" * 50)
    
    for name, beacon_x in beacons.items():
        # 1. Calculate physical distance to beacon
        actual_dist = abs(student_x - beacon_x)
        
        # 2. Simulate what the phone's Bluetooth antenna receives (RSSI)
        phone_rssi = calculate_rssi(actual_dist)
        
        # 3. The Phone App calculates how far away it thinks the beacon is
        phone_estimated_dist = estimate_distance(phone_rssi)
        
        # Determine how inaccurate the Bluetooth signal was due to noise
        error_margin = abs(actual_dist - phone_estimated_dist)
        
        print(f"   [{name}]")
        print(f"   Received Signal : {phone_rssi} dBm")
        print(f"   App Calculates  : {phone_estimated_dist} meters away (Error: {round(error_margin, 2)}m)")
        
    print("\n")
    student_x += 2.0
