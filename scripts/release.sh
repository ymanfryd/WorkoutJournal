#!/bin/bash
set -e

cd "$(dirname "$0")/.."

echo "→ Verifying keystore config"
if [ ! -f android/keystore.properties ]; then
    echo "FAIL: android/keystore.properties not found. Restore from backup."
    exit 1
fi
if [ ! -f android/app/workoutjournal-release.keystore ]; then
    echo "FAIL: android/app/workoutjournal-release.keystore not found. Restore from backup."
    exit 1
fi

VERSION_NAME=$(grep "versionName" android/app/build.gradle | head -1 | awk -F'"' '{print $2}')
VERSION_CODE=$(grep "versionCode" android/app/build.gradle | head -1 | awk '{print $2}')
echo "→ Building version $VERSION_NAME (code $VERSION_CODE)"

cd android
./gradlew --stop > /dev/null 2>&1 || true
./gradlew clean
./gradlew assembleRelease
cd ..

APK_SRC="android/app/build/outputs/apk/release/app-release.apk"
if [ ! -f "$APK_SRC" ]; then
    echo "FAIL: build succeeded but APK not found at $APK_SRC"
    exit 1
fi

OUT="/tmp/WorkoutJournal($VERSION_NAME).apk"
cp "$APK_SRC" "$OUT"
echo ""
echo "Done. APK ready at $OUT"
echo "Version: $VERSION_NAME (versionCode $VERSION_CODE)"
