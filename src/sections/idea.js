/** @jsx jsx */
import { jsx, Container, Grid, Box, Flex, Heading, Text } from 'theme-ui';
import Image from 'components/image';
import ideaImage from '../assets/images/idea.png';
import EngImage from '../assets/images/eng.png';
import diagramaImage from '../assets/images/diagrama.png';
import rightArrow from '../assets/images/icons/right-arrow.png';

const styles = {
  section: {
    pt: [9, null, null, 10, 11, 11, 11],
    pb: [7, null, null, 8, null, 9, 10],
  },
  grid: {
    gap: ['30px 30px'],
    justifyContent: 'center',
    gridTemplateColumns: [
      'repeat(1, 1fr)',
      null,
      null,
      'repeat(2, 1fr)',
      null,
      'repeat(2, 1fr)',
    ],
  },
  supportItem: {
    backgroundColor: '#F6F8FB',
    borderRadius: 7,
    flexDirection: ['column', null, null, null, null, 'row'],
    alignItems: 'flex-start',
    transition: '0.3s ease-in-out 0s',
    ':hover': {
      backgroundColor: 'white',
      boxShadow: '0px 15px 60px rgba(63, 90, 130, 0.12)',
    },
    display: 'flex',
    flexWrap: 'wrap',
  },
  card: {
    p: ['20px', '30px', '40px', '50px'],
    minHeight: 'auto',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
  },
  media: {
    alignItems: 'center',
    mr: [0, null, null, 6],
    mb: [5, null, null, null, null, 0],
    minWidth: [120],
    img: {
      maxWidth: ['100%', '80%', '70%', '60%', '50%'],
    },
  },
  content: {
    mt: ['-7px'],
    h2: {
      fontWeight: 700,
      fontSize: [2, null, null, null, 5],
      lineHeight: 1.5,
      color: 'textSecondary',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    p: {
      fontSize: [2, null, null, null, 16],
      lineHeight: [2.3],
      color: 'headingSecondary',
      mt: [4],
      textAlign: 'justify', // Adiciona alinhamento justificado
    },
  },
  highlightImage: {
    display: 'flex',
    justifyContent: 'center',
    mt: 6,
  },
};

const data = [
  {
    id: 1,
    icon: ideaImage,
    title: 'Nossa Idéia',
    description: `Nosso aplicativo visa facilitar o compartilhamento de informações entre usuários de ônibus para otimizar a tomada de decisão do usuário, proporcionando uma plataforma onde os passageiros podem trocar experiências, dicas e atualizações em tempo real de maneira gratuita.`,
  },
  {
    id: 2,
    icon: EngImage,
    title: 'Como Funciona',
    description: `Nosso aplicativo usa um dispositivo instalado no ônibus que emite sinais semelhantes aos de uma rede Wi-Fi para serem captados por nossos usuários e compartilhar a localização do ônibus associado ao dispositivo identificado. Os usuários podem acompanhar os coletivos, postar atualizações, reportar problemas e compartilhar informações úteis com outros passageiros, facilitando a comunicação no transporte público. A imagem abaixo ilustra essa dinâmica de compartilhamento.`,
  },
];

const Idea = () => {
  return (
    <Box as="section" id="support" sx={styles.section}>
      <Container>
        <Grid sx={styles.grid}>
          {data?.map((item) => (
            <Flex key={item.id} sx={{ ...styles.supportItem, ...styles.card }}>
              <Flex as="figure" sx={styles.media}>
                <Image src={item?.icon} alt={item?.title} sx={styles.media.img} />
              </Flex>
              <Box sx={styles.content}>
                <Heading>
                  {item?.title} <Image src={rightArrow} alt="rightArrow" />
                </Heading>
                <Text as="p">{item?.description}</Text>
              </Box>
            </Flex>
          ))}
        </Grid>
        <Box sx={styles.highlightImage}>
          <Image src={diagramaImage} alt="Destaque" sx={{ maxWidth: '80%' }} />
        </Box>
      </Container>
    </Box>
  );
};

export default Idea;
