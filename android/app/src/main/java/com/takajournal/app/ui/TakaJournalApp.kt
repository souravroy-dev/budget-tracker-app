package com.takajournal.app.ui

import androidx.activity.compose.BackHandler
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.Scaffold
import androidx.compose.material3.SnackbarHost
import androidx.compose.material3.SnackbarHostState
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.navigation.NavGraph.Companion.findStartDestination
import androidx.navigation.NavType
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.currentBackStackEntryAsState
import androidx.navigation.compose.rememberNavController
import androidx.navigation.navArgument
import com.takajournal.app.ui.history.HistoryScreen
import com.takajournal.app.ui.home.HomeScreen
import com.takajournal.app.ui.insights.InsightsScreen
import com.takajournal.app.ui.navigation.Screen
import com.takajournal.app.ui.navigation.TakaBottomNavBar
import com.takajournal.app.ui.quickadd.QuickAddBottomSheet
import com.takajournal.app.ui.secondary.BackupRestoreScreen
import com.takajournal.app.ui.secondary.BudgetScreen
import com.takajournal.app.ui.secondary.EditTransactionScreen
import com.takajournal.app.ui.secondary.LocationDetailsScreen
import com.takajournal.app.ui.secondary.PhotoViewerScreen
import com.takajournal.app.ui.secondary.SettingsScreen
import com.takajournal.app.ui.secondary.TransactionDetailScreen
import com.takajournal.app.ui.secondary.WalletDetailScreen
import com.takajournal.app.ui.wallets.WalletsScreen
import kotlinx.coroutines.launch

@Composable
fun TakaJournalApp() {
    val navController = rememberNavController()
    val navBackStackEntry by navController.currentBackStackEntryAsState()
    val currentRoute = navBackStackEntry?.destination?.route

    val snackbarHostState = remember { SnackbarHostState() }
    val coroutineScope = rememberCoroutineScope()

    var showQuickAddSheet by remember { mutableStateOf(false) }

    // Intercept Back press to dismiss bottom sheet first if open
    BackHandler(enabled = showQuickAddSheet) {
        showQuickAddSheet = false
    }

    // Determine if bottom bar should be visible (only on the 4 primary tabs)
    val isPrimaryTab = currentRoute in listOf(
        Screen.Home.route,
        Screen.History.route,
        Screen.Insights.route,
        Screen.Wallets.route
    )

    Scaffold(
        modifier = Modifier.fillMaxSize(),
        snackbarHost = { SnackbarHost(snackbarHostState) },
        bottomBar = {
            if (isPrimaryTab) {
                TakaBottomNavBar(
                    currentRoute = currentRoute,
                    onNavigateToDestination = { targetRoute ->
                        navController.navigate(targetRoute) {
                            // Pop up to the start destination of the graph to
                            // avoid building up a large stack of destinations
                            popUpTo(navController.graph.findStartDestination().id) {
                                saveState = true
                            }
                            // Avoid multiple copies of the same destination when
                            // reselecting the same item
                            launchSingleTop = true
                            // Restore state when reselecting a previously selected item
                            restoreState = true
                        }
                    },
                    onQuickAddClick = {
                        showQuickAddSheet = true
                    }
                )
            }
        }
    ) { innerPadding ->
        NavHost(
            navController = navController,
            startDestination = Screen.Home.route,
            modifier = Modifier.padding(innerPadding)
        ) {
            // Tab 1: Home
            composable(Screen.Home.route) {
                HomeScreen(
                    onNavigateToSettings = { navController.navigate(Screen.Settings.route) },
                    onNavigateToBudget = { navController.navigate(Screen.BudgetManagement.route) },
                    onNavigateToHistory = { navController.navigate(Screen.History.route) },
                    onNavigateToTransactionDetail = { txId ->
                        navController.navigate(Screen.TransactionDetail.createRoute(txId))
                    },
                    onQuickAddClick = { showQuickAddSheet = true }
                )
            }

            // Tab 2: History
            composable(Screen.History.route) {
                HistoryScreen(
                    onNavigateToTransactionDetail = { txId ->
                        navController.navigate(Screen.TransactionDetail.createRoute(txId))
                    }
                )
            }

            // Tab 3: Insights
            composable(Screen.Insights.route) {
                InsightsScreen()
            }

            // Tab 4: Wallets
            composable(Screen.Wallets.route) {
                WalletsScreen(
                    onNavigateToWalletDetail = { walletId ->
                        navController.navigate(Screen.WalletDetail.createRoute(walletId))
                    }
                )
            }

            // Secondary Routes
            composable(Screen.Settings.route) {
                SettingsScreen(
                    onNavigateBack = { navController.popBackStack() },
                    onNavigateToBackup = { navController.navigate(Screen.BackupRestore.route) }
                )
            }

            composable(Screen.BudgetManagement.route) {
                BudgetScreen(
                    onNavigateBack = { navController.popBackStack() }
                )
            }

            composable(Screen.BackupRestore.route) {
                BackupRestoreScreen(
                    onNavigateBack = { navController.popBackStack() }
                )
            }

            composable(
                route = Screen.TransactionDetail.route,
                arguments = listOf(navArgument("transactionId") { type = NavType.StringType })
            ) { backStackEntry ->
                val txId = backStackEntry.arguments?.getString("transactionId") ?: ""
                TransactionDetailScreen(
                    transactionId = txId,
                    onNavigateBack = { navController.popBackStack() },
                    onNavigateToEdit = { id -> navController.navigate(Screen.EditTransaction.createRoute(id)) },
                    onNavigateToPhoto = { uri -> navController.navigate(Screen.PhotoViewer.createRoute(uri)) },
                    onNavigateToLocation = { loc -> navController.navigate(Screen.LocationDetails.createRoute(loc, 23.8103, 90.4125)) }
                )
            }

            composable(
                route = Screen.EditTransaction.route,
                arguments = listOf(navArgument("transactionId") { type = NavType.StringType })
            ) { backStackEntry ->
                val txId = backStackEntry.arguments?.getString("transactionId") ?: ""
                EditTransactionScreen(
                    transactionId = txId,
                    onNavigateBack = { navController.popBackStack() }
                )
            }

            composable(
                route = Screen.WalletDetail.route,
                arguments = listOf(navArgument("walletId") { type = NavType.StringType })
            ) { backStackEntry ->
                val walletId = backStackEntry.arguments?.getString("walletId") ?: ""
                WalletDetailScreen(
                    walletId = walletId,
                    onNavigateBack = { navController.popBackStack() }
                )
            }

            composable(
                route = Screen.PhotoViewer.route,
                arguments = listOf(navArgument("photoUri") { type = NavType.StringType; defaultValue = "" })
            ) { backStackEntry ->
                val photoUri = backStackEntry.arguments?.getString("photoUri") ?: ""
                PhotoViewerScreen(
                    photoUri = photoUri,
                    onNavigateBack = { navController.popBackStack() }
                )
            }

            composable(
                route = Screen.LocationDetails.route,
                arguments = listOf(
                    navArgument("name") { type = NavType.StringType; defaultValue = "Dhaka" },
                    navArgument("lat") { type = NavType.FloatType; defaultValue = 23.8103f },
                    navArgument("lng") { type = NavType.FloatType; defaultValue = 90.4125f }
                )
            ) { backStackEntry ->
                val name = backStackEntry.arguments?.getString("name") ?: "Dhaka"
                LocationDetailsScreen(
                    locationName = name,
                    onNavigateBack = { navController.popBackStack() }
                )
            }
        }
    }

    // Modal Quick Add Bottom Sheet
    if (showQuickAddSheet) {
        QuickAddBottomSheet(
            onDismissRequest = { showQuickAddSheet = false },
            onSaveSuccess = { message ->
                coroutineScope.launch {
                    snackbarHostState.showSnackbar(message)
                }
            }
        )
    }
}
