package com.takajournal.app.ui.insights

enum class InsightsPeriod(val label: String) {
    DAY("Day"),
    WEEK("Week"),
    MONTH("Month"),
    YEAR("Year")
}

data class CategorySpending(
    val categoryId: String,
    val categoryName: String,
    val totalAmount: Double,
    val percentage: Float,
    val colorHex: String
)

data class InsightsUiState(
    val selectedPeriod: InsightsPeriod = InsightsPeriod.MONTH,
    val totalExpense: Double = 0.0,
    val totalIncome: Double = 0.0,
    val netSavings: Double = 0.0,
    val topCategories: List<CategorySpending> = emptyList(),
    val transactionCount: Int = 0,
    val isLoading: Boolean = false
)
