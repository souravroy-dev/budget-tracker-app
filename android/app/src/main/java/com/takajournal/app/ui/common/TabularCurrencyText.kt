package com.takajournal.app.ui.common

import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.FontWeight
import com.takajournal.app.domain.model.TransactionType
import com.takajournal.app.ui.theme.ExpenseCrimsonLight
import com.takajournal.app.ui.theme.IncomeMintLight
import com.takajournal.app.ui.theme.TransferIndigoLight
import java.text.DecimalFormat
import java.text.DecimalFormatSymbols
import java.util.Locale

@Composable
fun TabularCurrencyText(
    amount: Double,
    modifier: Modifier = Modifier,
    type: TransactionType? = null,
    showPrefixSign: Boolean = false,
    style: TextStyle = MaterialTheme.typography.titleMedium,
    color: Color = Color.Unspecified
) {
    val formatter = DecimalFormat("#,##0.00", DecimalFormatSymbols(Locale.US))
    val formattedNumber = formatter.format(Math.abs(amount))

    val sign = when {
        showPrefixSign && type == TransactionType.EXPENSE -> "- "
        showPrefixSign && type == TransactionType.INCOME -> "+ "
        else -> ""
    }

    val displayColor = when {
        color != Color.Unspecified -> color
        type == TransactionType.EXPENSE -> ExpenseCrimsonLight
        type == TransactionType.INCOME -> IncomeMintLight
        type == TransactionType.TRANSFER -> TransferIndigoLight
        else -> MaterialTheme.colorScheme.onSurface
    }

    Text(
        text = "$sign৳$formattedNumber",
        style = style,
        color = displayColor,
        fontWeight = FontWeight.SemiBold,
        modifier = modifier
    )
}
