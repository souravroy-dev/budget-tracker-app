package com.takajournal.app.ui.navigation

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.navigationBarsPadding
import androidx.compose.foundation.layout.offset
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Add
import androidx.compose.material.icons.filled.AccountBalanceWallet
import androidx.compose.material.icons.filled.BarChart
import androidx.compose.material.icons.filled.History
import androidx.compose.material.icons.filled.Home
import androidx.compose.material.icons.outlined.AccountBalanceWallet
import androidx.compose.material.icons.outlined.BarChart
import androidx.compose.material.icons.outlined.History
import androidx.compose.material.icons.outlined.Home
import androidx.compose.material3.FloatingActionButton
import androidx.compose.material3.FloatingActionButtonDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.remember
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.takajournal.app.ui.theme.EmeraldPrimaryLight

sealed class NavItem(
    val route: String,
    val title: String,
    val selectedIcon: ImageVector,
    val unselectedIcon: ImageVector
) {
    object Home : NavItem(
        route = Screen.Home.route,
        title = "Home",
        selectedIcon = Icons.Filled.Home,
        unselectedIcon = Icons.Outlined.Home
    )
    object History : NavItem(
        route = Screen.History.route,
        title = "History",
        selectedIcon = Icons.Filled.History,
        unselectedIcon = Icons.Outlined.History
    )
    object Insights : NavItem(
        route = Screen.Insights.route,
        title = "Insights",
        selectedIcon = Icons.Filled.BarChart,
        unselectedIcon = Icons.Outlined.BarChart
    )
    object Wallets : NavItem(
        route = Screen.Wallets.route,
        title = "Wallets",
        selectedIcon = Icons.Filled.AccountBalanceWallet,
        unselectedIcon = Icons.Outlined.AccountBalanceWallet
    )
}

@Composable
fun TakaBottomNavBar(
    currentRoute: String?,
    onNavigateToDestination: (String) -> Unit,
    onQuickAddClick: () -> Unit,
    modifier: Modifier = Modifier
) {
    Surface(
        modifier = modifier
            .fillMaxWidth()
            .navigationBarsPadding(),
        color = MaterialTheme.colorScheme.surface,
        tonalElevation = 3.dp,
        shadowElevation = 8.dp
    ) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .height(68.dp)
                .padding(horizontal = 8.dp),
            horizontalArrangement = Arrangement.SpaceAround,
            verticalAlignment = Alignment.CenterVertically
        ) {
            // Tab 1: Home
            BottomTabItem(
                item = NavItem.Home,
                isSelected = currentRoute == NavItem.Home.route,
                onClick = { onNavigateToDestination(NavItem.Home.route) },
                modifier = Modifier.weight(1f)
            )

            // Tab 2: History
            BottomTabItem(
                item = NavItem.History,
                isSelected = currentRoute == NavItem.History.route,
                onClick = { onNavigateToDestination(NavItem.History.route) },
                modifier = Modifier.weight(1f)
            )

            // Center Action: Quick Add (+) - Action button, not a tab
            Box(
                modifier = Modifier
                    .weight(1f)
                    .height(68.dp),
                contentAlignment = Alignment.Center
            ) {
                FloatingActionButton(
                    onClick = onQuickAddClick,
                    shape = CircleShape,
                    containerColor = MaterialTheme.colorScheme.primary,
                    contentColor = MaterialTheme.colorScheme.onPrimary,
                    elevation = FloatingActionButtonDefaults.elevation(defaultElevation = 4.dp),
                    modifier = Modifier.size(52.dp)
                ) {
                    Icon(
                        imageVector = Icons.Default.Add,
                        contentDescription = "Quick Add Transaction",
                        modifier = Modifier.size(28.dp)
                    )
                }
            }

            // Tab 3: Insights
            BottomTabItem(
                item = NavItem.Insights,
                isSelected = currentRoute == NavItem.Insights.route,
                onClick = { onNavigateToDestination(NavItem.Insights.route) },
                modifier = Modifier.weight(1f)
            )

            // Tab 4: Wallets
            BottomTabItem(
                item = NavItem.Wallets,
                isSelected = currentRoute == NavItem.Wallets.route,
                onClick = { onNavigateToDestination(NavItem.Wallets.route) },
                modifier = Modifier.weight(1f)
            )
        }
    }
}

@Composable
private fun BottomTabItem(
    item: NavItem,
    isSelected: Boolean,
    onClick: () -> Unit,
    modifier: Modifier = Modifier
) {
    val interactionSource = remember { MutableInteractionSource() }
    val contentColor = if (isSelected) {
        MaterialTheme.colorScheme.primary
    } else {
        MaterialTheme.colorScheme.onSurfaceVariant.copy(alpha = 0.7f)
    }

    Column(
        modifier = modifier
            .clip(RoundedCornerShape(12.dp))
            .clickable(
                interactionSource = interactionSource,
                indication = null,
                onClick = onClick
            )
            .padding(vertical = 8.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.Center
    ) {
        Icon(
            imageVector = if (isSelected) item.selectedIcon else item.unselectedIcon,
            contentDescription = item.title,
            tint = contentColor,
            modifier = Modifier.size(24.dp)
        )
        Text(
            text = item.title,
            style = MaterialTheme.typography.labelSmall.copy(
                fontSize = 11.sp,
                color = contentColor
            ),
            modifier = Modifier.padding(top = 4.dp)
        )
    }
}
