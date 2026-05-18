import { useState } from 'react';
import Badge from '@mui/material/Badge';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuItem from '@mui/material/MenuItem';
import Popover from '@mui/material/Popover';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import FilterListIcon from '@mui/icons-material/FilterList';

export interface ProductFilters {
  category: string;
  minPrice: string;
  maxPrice: string;
  availability: string;
}

interface IProps {
  filters: ProductFilters;
  categories: string[];
  onFiltersChange: (filters: ProductFilters) => void;
  onResetFilters: () => void;
}

export default function ProductFilter({
  filters,
  categories,
  onFiltersChange,
  onResetFilters,
}: IProps) {
  const [anchorElement, setAnchorElement] =
    useState<HTMLButtonElement | null>(null);

  const isOpen = Boolean(anchorElement);

  const activeFiltersCount = [
    filters.category,
    filters.minPrice,
    filters.maxPrice,
    filters.availability,
  ].filter(Boolean).length;

  function handleOpen(event: React.MouseEvent<HTMLButtonElement>) {
    setAnchorElement(event.currentTarget);
  }

  function handleClose() {
    setAnchorElement(null);
  }

  return (
    <>
      <Badge badgeContent={activeFiltersCount} color="primary">
        <IconButton
          onClick={handleOpen}
          sx={{
            width: 44,
            height: 44,
            border: '1px solid #d1d5db',
            borderRadius: '12px',
            backgroundColor: 'white',
            color: '#111827',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
            '&:hover': {
              backgroundColor: '#f3f4f6',
            },
          }}
        >
          <FilterListIcon />
        </IconButton>
      </Badge>

      <Popover
        open={isOpen}
        anchorEl={anchorElement}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <Box
          sx={{
            width: 320,
            p: 2,
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
          }}
        >
          <Typography variant="h6">Фильтр</Typography>

          <TextField
            select
            label="Категория"
            value={filters.category}
            onChange={(event) =>
              onFiltersChange({
                ...filters,
                category: event.target.value,
              })
            }
            fullWidth
          >
            <MenuItem value="">Все категории</MenuItem>

            {categories.map((category) => (
              <MenuItem key={category} value={category}>
                {category}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            label="Цена от"
            type="number"
            value={filters.minPrice}
            onChange={(event) =>
              onFiltersChange({
                ...filters,
                minPrice: event.target.value,
              })
            }
            fullWidth
          />

          <TextField
            label="Цена до"
            type="number"
            value={filters.maxPrice}
            onChange={(event) =>
              onFiltersChange({
                ...filters,
                maxPrice: event.target.value,
              })
            }
            fullWidth
          />

          <TextField
            select
            label="Наличие"
            value={filters.availability}
            onChange={(event) =>
              onFiltersChange({
                ...filters,
                availability: event.target.value,
              })
            }
            fullWidth
          >
            <MenuItem value="">Все товары</MenuItem>
            <MenuItem value="available">В наличии</MenuItem>
            <MenuItem value="notAvailable">Нет в наличии</MenuItem>
          </TextField>

          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button variant="outlined" onClick={onResetFilters} fullWidth>
              Сбросить
            </Button>

            <Button variant="contained" onClick={handleClose} fullWidth>
              ОК
            </Button>
          </Box>
        </Box>
      </Popover>
    </>
  );
}