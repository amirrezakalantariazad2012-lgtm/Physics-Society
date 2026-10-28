import os
import sys
import paramiko
from PIL import Image, ImageDraw

def generate_local_icons():
    # Base icon 512x512
    icon = Image.new("RGBA", (512, 512), (0, 0, 0, 0))
    draw = ImageDraw.Draw(icon)
    # Background circle with deep navy tone
    draw.ellipse([16, 16, 496, 496], fill=(15, 23, 42, 255), outline=(56, 189, 248, 255), width=16)
    # Orbital rings for physics atom
    draw.ellipse([90, 160, 422, 352], outline=(14, 165, 233, 220), width=12)
    draw.ellipse([160, 90, 352, 422], outline=(99, 102, 241, 220), width=12)
    # Center nucleus
    draw.ellipse([224, 224, 288, 288], fill=(56, 189, 248, 255), outline=(255, 255, 255, 255), width=6)
    # Orbiting electron particles
    draw.ellipse([80, 244, 104, 268], fill=(250, 204, 21, 255))
    draw.ellipse([408, 244, 432, 268], fill=(250, 204, 21, 255))
    draw.ellipse([244, 80, 268, 104], fill=(244, 63, 94, 255))
    draw.ellipse([244, 408, 268, 432], fill=(244, 63, 94, 255))

    densities = {
        "res/drawable": (512, 512),
        "res/mipmap-mdpi": (48, 48),
        "res/mipmap-hdpi": (72, 72),
        "res/mipmap-xhdpi": (96, 96),
        "res/mipmap-xxhdpi": (144, 144),
        "res/mipmap-xxxhdpi": (192, 192),
    }

    for folder, size in densities.items():
        dir_path = os.path.join("android_src", folder)
        os.makedirs(dir_path, exist_ok=True)
        img_resized = icon.resize(size, Image.Resampling.LANCZOS)
        out_file = os.path.join(dir_path, "ic_launcher.png")
        img_resized.save(out_file)
        print(f"Generated {out_file} ({size[0]}x{size[1]})")

def upload_directory(sftp, local_dir, remote_dir):
    try:
        sftp.mkdir(remote_dir)
    except IOError:
        pass
    for item in os.listdir(local_dir):
        local_path = os.path.join(local_dir, item)
        remote_path = remote_dir + "/" + item
        if os.path.isdir(local_path):
            upload_directory(sftp, local_path, remote_path)
        else:
            sftp.put(local_path, remote_path)

def main():
    print("=== Step 1: Generating standard Android mipmap launcher icons ===")
    generate_local_icons()

    print("\n=== Step 2: Connecting to server 192.168.1.150 ===")
    ssh = paramiko.SSHClient()
    ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    ssh.connect('192.168.1.150', username='mp', password='Mp13911391!')

    stdin, stdout, stderr = ssh.exec_command('rm -rf /tmp/sampad_apk_build && mkdir -p /tmp/sampad_apk_build')
    stdout.read()

    print("Uploading Android project files...")
    sftp = ssh.open_sftp()
    upload_directory(sftp, "android_src", "/tmp/sampad_apk_build")
    sftp.close()

    bash_build_script = """#!/usr/bin/env bash
set -e
BUILD_DIR="/tmp/sampad_apk_build"
ANDROID_JAR="/tmp/android-34.jar"
if [ ! -f "$ANDROID_JAR" ]; then
    ANDROID_JAR="/usr/lib/android-sdk/platforms/android-23/android.jar"
fi
AAPT="/usr/bin/aapt"
DX="/usr/local/bin/dx"
ZIPALIGN="/usr/bin/zipalign"
APKSIGNER="/usr/bin/apksigner"
JAVAC="/usr/bin/javac"
KEYTOOL="/usr/bin/keytool"

mkdir -p "$BUILD_DIR/bin"
mkdir -p "$BUILD_DIR/classes"
mkdir -p "$BUILD_DIR/gen"

echo "=== Compiling with AAPT & Platform: $ANDROID_JAR ==="
$AAPT package -f -m -J "$BUILD_DIR/gen" -M "$BUILD_DIR/AndroidManifest.xml" -S "$BUILD_DIR/res" -I "$ANDROID_JAR"

echo "=== Compiling Java source files ==="
$JAVAC -source 8 -target 8 -bootclasspath "$ANDROID_JAR" -d "$BUILD_DIR/classes" \
    "$BUILD_DIR/gen/ir/sampad/physicssociety/R.java" \
    "$BUILD_DIR/ir/sampad/physicssociety/MainActivity.java"

echo "=== Translating bytecode to Dalvik DEX ==="
$DX --dex --output="$BUILD_DIR/bin/classes.dex" "$BUILD_DIR/classes"

echo "=== Packaging resources APK ==="
$AAPT package -f -M "$BUILD_DIR/AndroidManifest.xml" -S "$BUILD_DIR/res" -I "$ANDROID_JAR" -F "$BUILD_DIR/bin/unaligned.apk"

echo "=== Adding classes.dex to APK ==="
cd "$BUILD_DIR/bin"
$AAPT add unaligned.apk classes.dex

echo "=== 4-byte Standard Zipalign ==="
$ZIPALIGN -f 4 unaligned.apk aligned.apk

echo "=== Generating Release Keystore if missing ==="
KEYSTORE="$BUILD_DIR/sampad.keystore"
if [ ! -f "$KEYSTORE" ]; then
    $KEYTOOL -genkeypair -v -keystore "$KEYSTORE" -storepass sampad1403 -alias sampad_key -keypass sampad1403 -keyalg RSA -keysize 2048 -validity 10000 -dname "CN=SampadPhysics, OU=PhysicsSociety, O=Sampad, L=Tehran, ST=Tehran, C=IR"
fi

echo "=== Signing APK with apksigner (v1, v2, v3 schemes with min-sdk 21) ==="
$APKSIGNER sign --ks "$KEYSTORE" --ks-pass pass:sampad1403 --key-pass pass:sampad1403 --min-sdk-version 21 --v1-signing-enabled true --v2-signing-enabled true --v3-signing-enabled true --out physics-society-signed.apk aligned.apk

echo "=== Verifying APK Signature Across All Schemes ==="
$APKSIGNER verify --verbose --min-sdk-version 21 physics-society-signed.apk

echo "=== AAPT Badging Summary ==="
$AAPT dump badging physics-society-signed.apk

ls -lh physics-society-signed.apk
"""

    sftp = ssh.open_sftp()
    with sftp.file('/tmp/sampad_apk_build/build.sh', 'w') as f:
        f.write(bash_build_script)
    sftp.close()

    print("Running build script on server...")
    stdin, stdout, stderr = ssh.exec_command('chmod +x /tmp/sampad_apk_build/build.sh && /tmp/sampad_apk_build/build.sh')
    
    for line in stdout:
        print(line, end="")
    err = stderr.read().decode()
    if err:
        print("STDERR:\n", err)

    print("\nDeploying APK to server host and docker container...")
    deploy_cmd = (
        "cp /tmp/sampad_apk_build/bin/physics-society-signed.apk /home/mp/physics-society/source/frontend/downloads/physics-society.apk && "
        "docker cp /tmp/sampad_apk_build/bin/physics-society-signed.apk physics-society-app:/app/frontend/downloads/physics-society.apk"
    )
    stdin, stdout, stderr = ssh.exec_command(deploy_cmd)
    deploy_err = stderr.read().decode()
    if deploy_err:
        print("Deploy notice:", deploy_err)
    else:
        print("APK successfully deployed to server host and docker container!")

    # Download to local workspace
    print("Downloading signed APK to local repository...")
    sftp = ssh.open_sftp()
    local_apk_path = os.path.abspath("frontend/downloads/physics-society.apk")
    sftp.get('/tmp/sampad_apk_build/bin/physics-society-signed.apk', local_apk_path)
    sftp.close()
    
    local_size = os.path.getsize(local_apk_path)
    print(f"\n[OK] Local APK updated successfully: {local_apk_path} ({local_size} bytes)")

    ssh.close()

if __name__ == '__main__':
    main()
