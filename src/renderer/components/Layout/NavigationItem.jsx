import React from 'react'
import {
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from '@mui/material'

function NavigationItem({ text, icon, active, onClick }) {
  return (
    <ListItem disablePadding>
      <ListItemButton
        onClick={onClick}
        sx={{
          backgroundColor: active ? 'action.selected' : 'transparent',
          '&:hover': {
            backgroundColor: 'action.hover',
          },
          borderRadius: 1,
          mx: 1,
          my: 0.5,
        }}
      >
        <ListItemIcon
          sx={{
            color: active ? 'primary.main' : 'text.secondary',
          }}
        >
          {icon}
        </ListItemIcon>
        <ListItemText 
          primary={text}
          sx={{
            '& .MuiListItemText-primary': {
              fontWeight: active ? 600 : 400,
              color: active ? 'primary.main' : 'text.primary',
            },
          }}
        />
      </ListItemButton>
    </ListItem>
  )
}

export default NavigationItem
