import { Container, Typography, Button, Box, Grid, Paper } from "@mui/material"
import { styled } from "@mui/material/styles"
import { RestaurantMenu, Favorite, People } from "@mui/icons-material"

// Styled components
const QuoteCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  height: "100%",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  background: "rgba(255, 255, 255, 0.9)",
  borderRadius: "12px",
  boxShadow: "0 8px 32px rgba(31, 38, 135, 0.15)",
  backdropFilter: "blur(4px)",
  border: "1px solid rgba(255, 255, 255, 0.18)",
  transition: "transform 0.3s ease-in-out",
  "&:hover": {
    transform: "translateY(-5px)",
  },
}))

const StyledButton = styled(Button)(() => ({
  borderRadius: "30px",
  padding: "12px 30px",
  fontSize: "1.1rem",
  fontWeight: "bold",
  boxShadow: "0 4px 20px rgba(255, 87, 34, 0.25)",
  transition: "all 0.3s ease",
  "&:hover": {
    transform: "translateY(-3px)",
    boxShadow: "0 6px 25px rgba(255, 87, 34, 0.4)",
  },
}))

const HeroSection = styled(Box)(({ theme }) => ({
  backgroundImage: "linear-gradient(135deg, #ffe8cc 0%, #fff6e5 100%)",
  padding: theme.spacing(10, 0),
  borderRadius: "0 0 30% 30% / 10%",
  marginBottom: theme.spacing(6),
}))

const Home = () => {
  const quotes = [
    {
      text: "Mejor son dos que uno, porque tienen mejor paga de su trabajo.",
      source: "Eclesiastés 4:9",
      icon: <People fontSize="large" color="primary" />,
    },
    {
      text: "Y si alguno prevaleciere contra uno, dos le resistirán; y cordón de tres dobleces no se rompe pronto.",
      source: "Eclesiastés 4:12",
      icon: <Favorite fontSize="large" color="secondary" />,
    },
    {
      text: "En todo tiempo ama el amigo; es como un hermano en tiempo de angustia.",
      source: "Proverbios 17:17",
      icon: <People fontSize="large" color="primary" />,
    },
    {
      text: "Amarás a tu prójimo como a ti mismo.",
      source: "Mateo 22:39",
      icon: <Favorite fontSize="large" color="secondary" />,
    },
  ]

  const handleOpenPDF =()=>{
    window.open('/menu.pdf','_blank');
  };

  return (
    <Box sx={{ overflow: "hidden" }}>
      <HeroSection>
        <Container maxWidth="lg">
          <Box
            sx={{
              opacity: 1,
              transform: "translateY(0)",
              transition: "opacity 1s, transform 1s",
            }}
          >
            <Typography
              variant="h2"
              align="center"
              gutterBottom
              sx={{
                color: "#FF5722",
                fontWeight: "bold",
                fontSize: { xs: "2.5rem", md: "3.5rem" },
                mb: 3,
              }}
            >
              Mejor Son Dos Que Uno
            </Typography>
          </Box>

          <Box
            sx={{
              opacity: 1,
              transition: "opacity 1s",
              animationDelay: "0.5s",
            }}
          >
            <Typography
              variant="h5"
              align="center"
              sx={{
                color: "#5D4037",
                mb: 4,
                fontStyle: "italic",
              }}
            >
              Donde la comunidad se reúne para disfrutar de lo mejor
            </Typography>
          </Box>
        </Container>
      </HeroSection>

      <Container maxWidth="lg">
        <Box>
          <Grid container spacing={4} sx={{ mb: 8 }}>
            {quotes.map((quote, index) => (
              <Grid item xs={12} md={6} key={index}>
                <Box
                  sx={{
                    opacity: 1,
                    transform: "translateY(0)",
                    transition: "opacity 0.8s ease-out, transform 0.8s ease-out",
                    transitionDelay: `${index * 0.1}s`,
                  }}
                >
                  <QuoteCard elevation={3}>
                    <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>{quote.icon}</Box>
                    <Typography
                      variant="h6"
                      align="center"
                      gutterBottom
                      sx={{
                        fontStyle: "italic",
                        color: "#5D4037",
                        fontWeight: "medium",
                        mb: 2,
                      }}
                    >
                      &quot;{quote.text}&quot;
                    </Typography>
                    <Typography
                      variant="subtitle1"
                      align="center"
                      sx={{
                        color: "#FF5722",
                        fontWeight: "bold",
                      }}
                    >
                      {quote.source}
                    </Typography>
                  </QuoteCard>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>

        <Box
          sx={{
            opacity: 1,
            transform: "translateY(0)",
            transition: "opacity 1s, transform 1s",
          }}
        >
          <Paper
            elevation={0}
            sx={{
              p: 4,
              mb: 8,
              borderRadius: "16px",
              background: "linear-gradient(135deg, #FFF8E1 0%, #FFECB3 100%)",
            }}
          >
            <Typography
              variant="body1"
              paragraph
              align="center"
              sx={{
                color: "#5D4037",
                fontSize: "1.1rem",
                lineHeight: 1.8,
                mb: 3,
              }}
            >
              La unión es la fuerza que impulsa el crecimiento y la superación; El amigo siempre está presente, el amor
              nos impulsa a cuidar de nuestro prójimo, y la ayuda mutua aligera cualquier carga. En Uno igual a dos
              creemos que cada encuentro es una oportunidad para tejer lazos de solidaridad y colaboración, creando una
              comunidad en la que el apoyo mutuo y la cooperación hacen que, en conjunto, seamos más fuertes y capaces
              de alcanzar metas que solos parecerían inalcanzables.
            </Typography>
            <Typography
              variant="body1"
              paragraph
              align="center"
              sx={{
                color: "#5D4037",
                fontSize: "1.1rem",
                lineHeight: 1.8,
                fontWeight: "medium",
              }}
            >
              En Uno igual a dos creemos que la fuerza y la creatividad emergen cuando nos unimos, demostrando que, en
              verdad, uno solo se convierte en dos al compartir, colaborar y crecer en comunidad.
            </Typography>
          </Paper>
        </Box>

        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            mb: 10,
            mt: 6,
          }}
        >
          <Box
            sx={{
              transform: "scale(1)",
              opacity: 1,
              transition: "transform 0.5s, opacity 0.5s",
              transitionTimingFunction: "cubic-bezier(0.175, 0.885, 0.32, 1.275)",
            }}
          >
            <StyledButton onClick={handleOpenPDF} variant="contained" color="primary" size="large" endIcon={<RestaurantMenu />} sx={{ mb: 2 }}>
              Ver Nuestro Menú
            </StyledButton>
          </Box>
          <Box
            sx={{
              opacity: 1,
              transition: "opacity 0.5s",
              transitionDelay: "0.5s",
            }}
          >
            <Typography variant="subtitle1" sx={{ color: "#9E9E9E", fontStyle: "italic" }}>
              Papas fritas • Arepas • Helados • Fresas con crema y más
            </Typography>
          </Box>
        </Box>
      </Container>
    </Box>
  )
}

export default Home