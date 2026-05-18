import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import MusicNoteIcon from '@mui/icons-material/MusicNote';

function Header() {
  return (
    <header className="header">
      <div className="container header-container">
        <Box className="brand-logo">
          <Box className="brand-icon">
            <MusicNoteIcon />
          </Box>

          <Box>
            <Typography className="brand-title" component="h1">
              SoundWave
            </Typography>
            <Typography className="brand-subtitle">
              музыкальное оборудование для сцены, студии и дома
            </Typography>
          </Box>
        </Box>

        <Box className="header-badge">
          Онлайн-магазин
        </Box>
      </div>
    </header>
  );
}

export default Header;