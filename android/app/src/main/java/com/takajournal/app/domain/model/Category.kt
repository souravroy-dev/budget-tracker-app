package com.takajournal.app.domain.model

data class Category(
    val id: String,
    val name: String,
    val type: TransactionType,
    val iconName: String,
    val colorHex: String
) {
    companion object {
        val defaultCategories = listOf(
            Category("cat_food", "Food & Groceries", TransactionType.EXPENSE, "Restaurant", "#006C4C"),
            Category("cat_transport", "Transport & Rickshaw", TransactionType.EXPENSE, "DirectionsBus", "#1976D2"),
            Category("cat_utilities", "Utilities & Bills", TransactionType.EXPENSE, "ElectricBolt", "#F57C00"),
            Category("cat_recharge", "Mobile Recharge", TransactionType.EXPENSE, "Smartphone", "#7B1FA2"),
            Category("cat_dining", "Dining Out", TransactionType.EXPENSE, "LocalCafe", "#D32F2F"),
            Category("cat_shopping", "Shopping", TransactionType.EXPENSE, "ShoppingBag", "#C2185B"),
            Category("cat_health", "Health & Pharmacy", TransactionType.EXPENSE, "LocalHospital", "#388E3C"),
            Category("cat_housing", "Rent & Housing", TransactionType.EXPENSE, "Home", "#5D4037"),
            Category("cat_other_exp", "Other Expense", TransactionType.EXPENSE, "Category", "#616161"),

            Category("cat_salary", "Salary", TransactionType.INCOME, "Payments", "#2E7D32"),
            Category("cat_freelance", "Freelancing", TransactionType.INCOME, "LaptopMac", "#0288D1"),
            Category("cat_business", "Business & Sales", TransactionType.INCOME, "Storefront", "#689F38"),
            Category("cat_gift", "Gift & Remittance", TransactionType.INCOME, "CardGiftcard", "#7B1FA2"),
            Category("cat_other_inc", "Other Income", TransactionType.INCOME, "Savings", "#00796B"),

            Category("cat_transfer", "Transfer", TransactionType.TRANSFER, "SwapHoriz", "#455A64")
        )
    }
}
