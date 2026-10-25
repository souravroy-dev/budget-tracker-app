package com.takajournal.app.domain.model

data class Budget(
    val id: String,
    val categoryId: String? = null, // null means overall total monthly budget
    val amountLimit: Double,
    val month: Int,
    val year: Int
)
