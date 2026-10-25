package com.takajournal.app.ui.navigation

sealed class Screen(val route: String) {
    // Primary 4 tabs
    object Home : Screen("home")
    object History : Screen("history")
    object Insights : Screen("insights")
    object Wallets : Screen("wallets")

    // Secondary routes
    object Settings : Screen("settings")
    object BudgetManagement : Screen("budget_management")
    object BackupRestore : Screen("backup_restore")
    object AddWallet : Screen("add_wallet")

    object TransactionDetail : Screen("transaction_detail/{transactionId}") {
        fun createRoute(transactionId: String) = "transaction_detail/$transactionId"
    }

    object EditTransaction : Screen("edit_transaction/{transactionId}") {
        fun createRoute(transactionId: String) = "edit_transaction/$transactionId"
    }

    object WalletDetail : Screen("wallet_detail/{walletId}") {
        fun createRoute(walletId: String) = "wallet_detail/$walletId"
    }

    object PhotoViewer : Screen("photo_viewer?photoUri={photoUri}") {
        fun createRoute(photoUri: String) = "photo_viewer?photoUri=$photoUri"
    }

    object LocationDetails : Screen("location_details?name={name}&lat={lat}&lng={lng}") {
        fun createRoute(name: String, lat: Double, lng: Double) =
            "location_details?name=$name&lat=$lat&lng=$lng"
    }
}
