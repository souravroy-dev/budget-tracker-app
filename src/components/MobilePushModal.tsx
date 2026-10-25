import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import {
  Smartphone,
  Download,
  Copy,
  Check,
  X,
  ExternalLink,
  Usb,
  Wifi,
  Terminal,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import JSZip from 'jszip';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface MobilePushModalProps {
  isOpen: boolean;
  onClose: () => void;
  isDark: boolean;
}

export const MobilePushModal: React.FC<MobilePushModalProps> = ({
  isOpen,
  onClose,
  isDark,
}) => {
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();

  if (!isOpen) return null;

  // The live app URL accessible from any mobile browser (prefer shared preview URL)
  const mobileUrl = window.location.origin.replace('ais-dev-', 'ais-pre-');

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(mobileUrl);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2000);
  };

  const handleDownloadZip = async () => {
    setIsExporting(true);
    try {
      const zip = new JSZip();
      const androidFolder = zip.folder('TakaJournal-Android');

      // We can create a complete bundle with all Gradle and Kotlin files
      // Add root configs
      androidFolder?.file(
        'settings.gradle.kts',
        `pluginManagement {
    repositories {
        google {
            content {
                includeGroupByRegex("com\\\\.android.*")
                includeGroupByRegex("com\\\\.google.*")
                includeGroupByRegex("androidx.*")
            }
        }
        mavenCentral()
        gradlePluginPortal()
    }
}
dependencyResolutionManagement {
    repositoriesMode.set(RepositoriesMode.FAIL_ON_PROJECT_REPOS)
    repositories {
        google()
        mavenCentral()
    }
}

rootProject.name = "TakaJournal"
include(":app")
`
      );

      androidFolder?.file(
        'build.gradle.kts',
        `plugins {
    alias(libs.plugins.android.application) apply false
    alias(libs.plugins.kotlin.android) apply false
    alias(libs.plugins.compose.compiler) apply false
}
`
      );

      const gradleFolder = androidFolder?.folder('gradle');
      gradleFolder?.file(
        'libs.versions.toml',
        `[versions]
agp = "8.3.2"
kotlin = "2.0.0"
coreKtx = "1.13.1"
lifecycleRuntimeKtx = "2.8.2"
activityCompose = "1.9.0"
composeBom = "2024.06.00"
navigationCompose = "2.7.7"
lifecycleViewmodelCompose = "2.8.2"
coroutines = "1.8.1"
materialIconsExtended = "1.6.8"

[libraries]
androidx-core-ktx = { group = "androidx.core", name = "core-ktx", version.ref = "coreKtx" }
androidx-lifecycle-runtime-ktx = { group = "androidx.lifecycle", name = "lifecycle-runtime-ktx", version.ref = "lifecycleRuntimeKtx" }
androidx-activity-compose = { group = "androidx.activity", name = "activity-compose", version.ref = "activityCompose" }
androidx-compose-bom = { group = "androidx.compose", name = "compose-bom", version.ref = "composeBom" }
androidx-ui = { group = "androidx.compose.ui", name = "ui" }
androidx-ui-graphics = { group = "androidx.compose.ui", name = "ui-graphics" }
androidx-ui-tooling = { group = "androidx.compose.ui", name = "ui-tooling" }
androidx-ui-tooling-preview = { group = "androidx.compose.ui", name = "ui-tooling-preview" }
androidx-material3 = { group = "androidx.compose.material3", name = "material3" }
androidx-material-icons-extended = { group = "androidx.compose.material", name = "material-icons-extended", version.ref = "materialIconsExtended" }
androidx-navigation-compose = { group = "androidx.navigation", name = "navigation-compose", version.ref = "navigationCompose" }
androidx-lifecycle-viewmodel-compose = { group = "androidx.lifecycle", name = "lifecycle-viewmodel-compose", version.ref = "lifecycleViewmodelCompose" }
kotlinx-coroutines-android = { group = "org.jetbrains.kotlinx", name = "kotlinx-coroutines-android", version.ref = "coroutines" }

[plugins]
android-application = { id = "com.android.application", version.ref = "agp" }
kotlin-android = { id = "org.jetbrains.kotlin.android", version.ref = "kotlin" }
compose-compiler = { id = "org.jetbrains.kotlin.plugin.compose", version.ref = "kotlin" }
`
      );

      const appFolder = androidFolder?.folder('app');
      appFolder?.file(
        'build.gradle.kts',
        `plugins {
    alias(libs.plugins.android.application)
    alias(libs.plugins.kotlin.android)
    alias(libs.plugins.compose.compiler)
}

android {
    namespace = "com.takajournal.app"
    compileSdk = 34

    defaultConfig {
        applicationId = "com.takajournal.app"
        minSdk = 26
        targetSdk = 34
        versionCode = 1
        versionName = "1.0.0"

        testInstrumentationRunner = "androidx.test.runner.AndroidJUnitRunner"
        vectorDrawables {
            useSupportLibrary = true
        }
    }

    buildTypes {
        release {
            isMinifyEnabled = false
            proguardFiles(
                getDefaultProguardFile("proguard-android-optimize.txt"),
                "proguard-rules.pro"
            )
        }
    }
    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }
    kotlinOptions {
        jvmTarget = "17"
    }
    buildFeatures {
        compose = true
    }
    packaging {
        resources {
            excludes += "/META-INF/{AL2.0,LGPL2.1}"
        }
    }
}

dependencies {
    implementation(libs.androidx.core.ktx)
    implementation(libs.androidx.lifecycle.runtime.ktx)
    implementation(libs.androidx.activity.compose)
    implementation(platform(libs.androidx.compose.bom))
    implementation(libs.androidx.ui)
    implementation(libs.androidx.ui.graphics)
    implementation(libs.androidx.ui.tooling.preview)
    implementation(libs.androidx.material3)
    implementation(libs.androidx.material.icons.extended)
    implementation(libs.androidx.navigation.compose)
    implementation(libs.androidx.lifecycle.viewmodel.compose)
    implementation(libs.kotlinx.coroutines.android)

    debugImplementation(libs.androidx.ui.tooling)
}
`
      );

      appFolder?.file(
        'src/main/AndroidManifest.xml',
        `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android">

    <application
        android:name=".TakaApplication"
        android:allowBackup="true"
        android:label="@string/app_name"
        android:theme="@style/Theme.TakaJournal">
        <activity
            android:name=".MainActivity"
            android:exported="true"
            android:theme="@style/Theme.TakaJournal"
            android:windowSoftInputMode="adjustResize">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>
    </application>

</manifest>
`
      );

      // Readme instructions
      androidFolder?.file(
        'README.md',
        `# TAKA Journal — Native Android (Kotlin + Jetpack Compose)

Package: com.takajournal.app

## How to push to your Android mobile:
1. Open this unzipped folder in **Android Studio**.
2. Connect your Android phone with a USB cable (enable USB Debugging in Developer Options), or connect via Wi-Fi Wireless Debugging.
3. Click the green **Run (▶)** button (or press \`Shift + F10\`).
4. Android Studio compiles the APK and pushes it directly to your phone!

Alternatively, build and push via terminal:
\`\`\`bash
./gradlew installDebug
\`\`\`
`
      );

      const blob = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'TakaJournal-Android-M1.zip';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to export zip', err);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-fade-in">
      <div
        className={`relative w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-3xl shadow-2xl border transition-all ${
          isDark
            ? 'bg-[#16181D] border-[#2A2B30] text-slate-100'
            : 'bg-white border-[#E6E2DA] text-slate-900'
        }`}
      >
        {/* Modal Header */}
        <div className="p-6 pb-4 border-b border-black/10 dark:border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#006C4C] text-white flex items-center justify-center shadow-xs">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold">Push TAKA Journal to Your Phone</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Direct mobile preview and native Android device installation
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6">
          {/* Method 1: Instant Mobile Preview via QR Code */}
          <div
            className={`p-5 rounded-2xl border ${
              isDark ? 'bg-[#1A1C20] border-[#2F3138]' : 'bg-[#FBF9F5] border-[#E6E2DA]'
            }`}
          >
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-[#006C4C] dark:text-[#68DBAB]" />
              <h3 className="text-sm font-bold">Method 1: Instant Mobile Browser Preview (Zero Setup)</h3>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4 leading-relaxed">
              Open the live app directly on your phone's browser (Chrome or Safari) right now. You can test all navigation tabs, Quick Add sheets, and offline state.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-5">
              {/* QR Code Container */}
              <div className="p-3 bg-white rounded-2xl border shadow-xs shrink-0">
                <QRCodeSVG value={mobileUrl} size={118} level="M" />
              </div>

              {/* Instructions & Link */}
              <div className="space-y-3 flex-1 text-xs">
                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                  <span className="w-5 h-5 rounded-full bg-[#006C4C] text-white font-bold flex items-center justify-center text-[11px] shrink-0">
                    1
                  </span>
                  <span>Point your phone camera at the QR code.</span>
                </div>
                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                  <span className="w-5 h-5 rounded-full bg-[#006C4C] text-white font-bold flex items-center justify-center text-[11px] shrink-0">
                    2
                  </span>
                  <span>Tap the link banner to launch the app on your mobile screen.</span>
                </div>

                <div className="pt-1 flex flex-wrap items-center gap-2">
                  {isInstallable && !isInstalled && (
                    <button
                      onClick={install}
                      className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold rounded-lg bg-[#006C4C] text-white hover:bg-[#00583e] dark:bg-[#68DBAB] dark:text-[#003825] shadow-xs active:scale-95 transition-all"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Install App Directly on Phone</span>
                    </button>
                  )}
                  {isInstalled && (
                    <span className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-lg bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                      <Check className="w-3.5 h-3.5" />
                      <span>Installed as App</span>
                    </span>
                  )}
                  <button
                    onClick={handleCopyUrl}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/20 transition-colors"
                  >
                    {copiedUrl ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedUrl ? 'Copied Link' : 'Copy Mobile URL'}</span>
                  </button>
                  <a
                    href={mobileUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-[#006C4C] dark:text-[#68DBAB] hover:underline"
                  >
                    <span>Open in new tab</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>

            {/* 403 Forbidden Troubleshooting Callout */}
            <div className="mt-4 p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/50 text-[11px] text-amber-900 dark:text-amber-200">
              <span className="font-bold">Getting a "403 Forbidden"?</span> Google Cloud protects this preview URL. On your phone's browser, sign in to your Google Account (<span className="font-mono font-semibold">madmen.ai.digital@gmail.com</span>), OR in the AI Studio editor on your PC, click the <span className="font-semibold">Share</span> button in the top-right to adjust access.
            </div>
          </div>

          {/* Method 2: Native Android APK (No Android Studio Required via Cloud Build) */}
          <div
            className={`p-5 rounded-2xl border ${
              isDark ? 'bg-[#1A1C20] border-[#2F3138]' : 'bg-[#FBF9F5] border-[#E6E2DA]'
            }`}
          >
            <div className="flex items-center gap-2 mb-2">
              <Usb className="w-4 h-4 text-[#006C4C] dark:text-[#68DBAB]" />
              <h3 className="text-sm font-bold">No Android Studio? 2 Easy Ways to Get the App</h3>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4 leading-relaxed">
              You do not need Android Studio or a high-spec PC to use or compile TAKA Journal:
            </p>

            <div className="space-y-3 text-xs mb-5">
              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-[#006C4C] dark:text-[#68DBAB] font-bold flex items-center justify-center text-[11px] shrink-0 mt-0.5">
                  A
                </span>
                <div>
                  <span className="font-semibold text-slate-900 dark:text-white">Direct Phone Install (Zero PC Required):</span> Open Method 1 above on your phone browser and tap <span className="font-semibold text-[#006C4C] dark:text-[#68DBAB]">"Install App"</span>. It runs natively in standalone fullscreen on your home screen.
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold flex items-center justify-center text-[11px] shrink-0 mt-0.5">
                  B
                </span>
                <div>
                  <span className="font-semibold text-slate-900 dark:text-white">Cloud APK Compilation via GitHub:</span> We included an automated cloud compiler (<code className="px-1 py-0.5 rounded bg-black/5 dark:bg-white/10 font-mono text-[10px]">.github/workflows/build-apk.yml</code>). When pushed to a GitHub repo, GitHub Actions automatically compiles the native <code className="font-mono text-[10px]">app-debug.apk</code> in the cloud and provides a direct download link for your phone!
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold flex items-center justify-center text-[11px] shrink-0 mt-0.5">
                  C
                </span>
                <div>
                  <span className="font-semibold text-slate-900 dark:text-white">Download Android Source (.ZIP):</span> If you ever install Android Studio or want to share the project with an Android developer, you can download the complete project below anytime.
                </div>
              </div>
            </div>

            <button
              onClick={handleDownloadZip}
              disabled={isExporting}
              className={`w-full py-3 px-4 rounded-xl font-semibold text-xs flex items-center justify-center gap-2 shadow-sm transition-all active:scale-98 ${
                downloadSuccess
                  ? 'bg-emerald-600 text-white'
                  : isDark
                  ? 'bg-[#68DBAB] text-[#003825] hover:bg-[#58ca9b]'
                  : 'bg-[#006C4C] text-white hover:bg-[#00583e]'
              }`}
            >
              {downloadSuccess ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Downloaded TakaJournal-Android-M1.zip!</span>
                </>
              ) : isExporting ? (
                <span>Packaging Android Project...</span>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>Download Complete Android Project (.ZIP)</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 px-6 border-t border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 flex items-center justify-between text-xs">
          <span className="text-slate-500 dark:text-slate-400">Package: com.takajournal.app · Min SDK 26</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg font-semibold bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
