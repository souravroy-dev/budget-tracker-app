package com.takajournal.app.ui.theme

import android.app.Activity
import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.material3.lightColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.runtime.SideEffect
import androidx.compose.ui.graphics.toArgb
import androidx.compose.ui.platform.LocalView
import androidx.core.view.WindowCompat

private val LightColorScheme = lightColorScheme(
    primary = EmeraldPrimaryLight,
    onPrimary = OnEmeraldLight,
    primaryContainer = EmeraldContainerLight,
    onPrimaryContainer = OnEmeraldContainerLight,
    secondary = CharcoalTextSecondaryLight,
    onSecondary = OnEmeraldLight,
    background = WarmBackgroundLight,
    onBackground = CharcoalTextLight,
    surface = WarmSurfaceLight,
    onSurface = CharcoalTextLight,
    surfaceVariant = WarmSurfaceVariantLight,
    onSurfaceVariant = CharcoalTextSecondaryLight,
    outline = HairlineBorderLight
)

private val DarkColorScheme = darkColorScheme(
    primary = EmeraldPrimaryDark,
    onPrimary = OnEmeraldDark,
    primaryContainer = EmeraldContainerDark,
    onPrimaryContainer = OnEmeraldContainerDark,
    secondary = LightTextSecondaryDark,
    onSecondary = DeepObsidianDark,
    background = DeepObsidianDark,
    onBackground = LightTextDark,
    surface = GraphiteSurfaceDark,
    onSurface = LightTextDark,
    surfaceVariant = GraphiteSurfaceVariantDark,
    onSurfaceVariant = LightTextSecondaryDark,
    outline = HairlineBorderDark
)

@Composable
fun TakaJournalTheme(
    darkTheme: Boolean = isSystemInDarkTheme(),
    content: @Composable () -> Unit
) {
    val colorScheme = if (darkTheme) DarkColorScheme else LightColorScheme
    val view = LocalView.current
    if (!view.isInEditMode) {
        SideEffect {
            val window = (view.context as? Activity)?.window
            if (window != null) {
                window.statusBarColor = colorScheme.background.toArgb()
                window.navigationBarColor = colorScheme.background.toArgb()
                WindowCompat.getInsetsController(window, view).isAppearanceLightStatusBars = !darkTheme
                WindowCompat.getInsetsController(window, view).isAppearanceLightNavigationBars = !darkTheme
            }
        }
    }

    MaterialTheme(
        colorScheme = colorScheme,
        typography = Typography,
        shapes = Shapes,
        content = content
    )
}
