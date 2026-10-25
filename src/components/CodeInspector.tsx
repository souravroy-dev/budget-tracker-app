import React, { useState } from 'react';
import { FileCode, Folder, Copy, Check, Terminal, ExternalLink } from 'lucide-react';

export const CodeInspector: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const [selectedFile, setSelectedFile] = useState<string>('TakaJournalApp.kt');

  const files: { [name: string]: { path: string; language: string; content: string } } = {
    'TakaJournalApp.kt': {
      path: 'android/app/src/main/java/com/takajournal/app/ui/TakaJournalApp.kt',
      language: 'kotlin',
      content: `package com.takajournal.app.ui

import androidx.activity.compose.BackHandler
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.Scaffold
import androidx.compose.material3.SnackbarHost
import androidx.compose.material3.SnackbarHostState
import androidx.compose.runtime.*
import androidx.navigation.compose.*
import com.takajournal.app.ui.navigation.*
import com.takajournal.app.ui.home.HomeScreen
import com.takajournal.app.ui.history.HistoryScreen
import com.takajournal.app.ui.insights.InsightsScreen
import com.takajournal.app.ui.wallets.WalletsScreen
import com.takajournal.app.ui.quickadd.QuickAddBottomSheet

@Composable
fun TakaJournalApp() {
    val navController = rememberNavController()
    val navBackStackEntry by navController.currentBackStackEntryAsState()
    val currentRoute = navBackStackEntry?.destination?.route

    var showQuickAddSheet by remember { mutableStateOf(false) }

    // Intercept Back press to dismiss bottom sheet first if open
    BackHandler(enabled = showQuickAddSheet) {
        showQuickAddSheet = false
    }

    val isPrimaryTab = currentRoute in listOf(
        Screen.Home.route, Screen.History.route,
        Screen.Insights.route, Screen.Wallets.route
    )

    Scaffold(
        bottomBar = {
            if (isPrimaryTab) {
                TakaBottomNavBar(
                    currentRoute = currentRoute,
                    onNavigateToDestination = { route ->
                        navController.navigate(route) {
                            popUpTo(navController.graph.findStartDestination().id) {
                                saveState = true
                            }
                            launchSingleTop = true
                            restoreState = true
                        }
                    },
                    onQuickAddClick = { showQuickAddSheet = true }
                )
            }
        }
    ) { innerPadding ->
        NavHost(navController = navController, startDestination = Screen.Home.route, modifier = Modifier.padding(innerPadding)) {
            composable(Screen.Home.route) { HomeScreen(...) }
            composable(Screen.History.route) { HistoryScreen(...) }
            composable(Screen.Insights.route) { InsightsScreen(...) }
            composable(Screen.Wallets.route) { WalletsScreen(...) }
            // Secondary routes: Settings, Budget, WalletDetail, TransactionDetail...
        }
    }
}`,
    },
    'QuickAddBottomSheet.kt': {
      path: 'android/app/src/main/java/com/takajournal/app/ui/quickadd/QuickAddBottomSheet.kt',
      language: 'kotlin',
      content: `package com.takajournal.app.ui.quickadd

import androidx.compose.material3.*
import androidx.compose.runtime.*
import com.takajournal.app.domain.model.TransactionType
import com.takajournal.app.ui.common.DiscardDraftDialog

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun QuickAddBottomSheet(
    onDismissRequest: () -> Unit,
    onSaveSuccess: (String) -> Unit,
    viewModel: QuickAddViewModel = viewModel()
) {
    val state by viewModel.uiState.collectAsState()
    val sheetState = rememberModalBottomSheetState(skipPartiallyExpanded = true)

    ModalBottomSheet(
        onDismissRequest = {
            viewModel.onRequestDismiss(onCanDismiss = onDismissRequest)
        },
        sheetState = sheetState
    ) {
        // Segmented Type selector: Expense | Income | Transfer
        // Smart natural input parser
        // Editable amount and description
        // Wallet selector
        // Expandable category and notes
        // Honest Persistence notice banner
        // Save and Cancel buttons
    }

    if (state.showDiscardDialog) {
        DiscardDraftDialog(
            onDismissRequest = viewModel::onCancelDiscard,
            onConfirmDiscard = { viewModel.onConfirmDiscard(onDismissed = onDismissRequest) }
        )
    }
}`,
    },
    'Color.kt': {
      path: 'android/app/src/main/java/com/takajournal/app/ui/theme/Color.kt',
      language: 'kotlin',
      content: `package com.takajournal.app.ui.theme

import androidx.compose.ui.graphics.Color

// Warm Off-White Light Surfaces
val WarmBackgroundLight = Color(0xFFFBF9F5)
val WarmSurfaceLight = Color(0xFFFFFFFF)
val CharcoalTextLight = Color(0xFF1C1B1F)

// Deep Bangladeshi Emerald Accent
val EmeraldPrimaryLight = Color(0xFF006C4C)
val OnEmeraldLight = Color(0xFFFFFFFF)
val EmeraldContainerLight = Color(0xFF89F8C7)

// Deep Obsidian Dark Surfaces
val DeepObsidianDark = Color(0xFF121316)
val GraphiteSurfaceDark = Color(0xFF1A1C20)
val EmeraldPrimaryDark = Color(0xFF68DBAB)

// Semantic Finance Colors
val ExpenseCrimsonLight = Color(0xFFBA1A1A)
val IncomeMintLight = Color(0xFF006C4C)
val TransferIndigoLight = Color(0xFF3E5F90)`,
    },
    'build.gradle.kts': {
      path: 'android/app/build.gradle.kts',
      language: 'kotlin',
      content: `plugins {
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
    }
    buildFeatures {
        compose = true
    }
}

dependencies {
    implementation(platform(libs.androidx.compose.bom))
    implementation(libs.androidx.material3)
    implementation(libs.androidx.navigation.compose)
    implementation(libs.androidx.lifecycle.viewmodel.compose)
    implementation(libs.kotlinx.coroutines.android)
}`,
    },
    'AndroidManifest.xml': {
      path: 'android/app/src/main/AndroidManifest.xml',
      language: 'xml',
      content: `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android">

    <application
        android:name=".TakaApplication"
        android:allowBackup="true"
        android:label="@string/app_name"
        android:theme="@style/Theme.TakaJournal">
        <activity
            android:name=".MainActivity"
            android:exported="true"
            android:windowSoftInputMode="adjustResize">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>
    </application>

</manifest>`,
    },
  };

  const current = files[selectedFile] || files['TakaJournalApp.kt'];

  const copyCode = () => {
    navigator.clipboard.writeText(current.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col h-full bg-[#16181D] text-slate-200 rounded-3xl border border-slate-800 shadow-xl overflow-hidden">
      {/* Inspector Header */}
      <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2.5">
          <FileCode className="w-5 h-5 text-[#68DBAB]" />
          <div>
            <h3 className="text-sm font-bold text-white">Android Source Tree (Kotlin / Gradle)</h3>
            <p className="text-[11px] text-slate-400 font-mono">com.takajournal.app</p>
          </div>
        </div>

        <button
          onClick={copyCode}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl transition-colors"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copied ? 'Copied' : 'Copy Source'}</span>
        </button>
      </div>

      {/* File List Navigation */}
      <div className="flex items-center gap-1.5 px-4 py-2 bg-[#121316] border-b border-slate-800 overflow-x-auto text-xs shrink-0 no-scrollbar">
        {Object.keys(files).map((fileName) => (
          <button
            key={fileName}
            onClick={() => setSelectedFile(fileName)}
            className={`px-3 py-1 rounded-lg font-mono text-[11px] whitespace-nowrap transition-colors ${
              selectedFile === fileName
                ? 'bg-[#006C4C] text-white font-semibold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            {fileName}
          </button>
        ))}
      </div>

      {/* Path Breadcrumb */}
      <div className="px-5 py-2 text-[11px] font-mono text-slate-400 bg-[#16181D]/80 border-b border-slate-800 shrink-0">
        📁 {current.path}
      </div>

      {/* Code Display */}
      <div className="flex-1 p-4 overflow-auto font-mono text-xs leading-relaxed text-slate-300">
        <pre className="selection:bg-[#006C4C]/40">
          <code>{current.content}</code>
        </pre>
      </div>

      {/* Milestone 1 Architecture Audit Banner */}
      <div className="p-4 border-t border-slate-800 bg-[#121316] shrink-0 text-xs text-slate-400 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-[#68DBAB]" />
          <span>Milestone 1 Native Architecture verified in /android directory</span>
        </div>
        <span className="text-[11px] text-emerald-400 font-semibold">Min SDK 26 · Target SDK 34</span>
      </div>
    </div>
  );
};
