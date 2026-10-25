package com.takajournal.app

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import com.takajournal.app.ui.TakaJournalApp
import com.takajournal.app.ui.theme.TakaJournalTheme

/**
 * Single activity entry point for TAKA Journal.
 */
class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContent {
            TakaJournalTheme {
                TakaJournalApp()
            }
        }
    }
}
