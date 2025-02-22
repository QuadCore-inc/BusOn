/** @jsx jsx */
import { jsx, Box, Flex, Container, Heading, Text } from 'theme-ui';
import { rgba } from 'polished';
import Image from 'components/image';
import SubscriptionForm from 'components/subscription-form';
import illustration from 'assets/images/banner.png';

const Banner = () => {
  return (
    <Box as="section" id="home" sx={styles.section}>
      <Container>
        <Box sx={styles.contentWrapper}>
          <Box sx={styles.bannerContent}>
            <Heading as="h1" sx={styles.heading}>
              Aplicativo para visualizar localização de ônibus em tempo real.
            </Heading>
            <Text as="p">
            Já passou pela frustração de escolher entre pegar dois ônibus para evitar atrasos ou gastar mais em transporte particular? Todas essas indecisões acontecem porque falta uma informação essencial: a localização do seu ônibus em tempo real! Nosso app visa resolver esse problema com uma solução inteligente e colaborativa! Quer transformar suas viagens pela cidade? 🚀 Saiba mais nas próximas seções e inscreva-se para receber novidades!
            </Text>
            <SubscriptionForm sx={styles.subscriptionForm} />
          </Box>
          <Flex as="figure" sx={styles.bannerImage}>
            <Image src={illustration} alt="illustration" />
          </Flex>
        </Box>
      </Container>
    </Box>
  );
};

export default Banner;

const styles = {
  section: {
    backgroundColor: '#FFFCF7',
    pt: [14, null, null, null, null, 0],
    pb: [6, null, null, 7, 11, 0],
  },
  contentWrapper: {
    gap: ['50px 50px'],
    display: ['block', null, null, null, 'grid'],
    gridTemplateColumns: [null, null, null, null, '1fr 1fr', '0.95fr 1.05fr'],
    alignItems: 'center',
    minHeight: ['auto', null, null, null, '38vh', '100vh'],
    pt: [null, null, null, 8, 0, 9, null],
    '@media only screen and (min-width:1900px)': {
      pt: 10,
    },
  },
  bannerContent: {
    margin: [null, null, null, '0 auto', 0],
    maxWidth: [null, null, null, 600, 'none'],
    textAlign: [null, null, null, 'center', 'left'],
    h1: {
      fontWeight: 700,
      fontSize: [8, null, null, 10, 45, null, 12, 14],
      lineHeight: [1.26, null, null, 1.5, 1.2, 1.26],
      letterSpacing: [0, null, null, null, '-1.5px'],
      color: 'textSecondary',
      '@media screen and (min-width: 1441px) and (max-width:1600px)': {
        fontSize: 12,
        lineHeight: 1.5,
      },
    },
    p: {
      fontSize: [1, null, null, 2, 3],
      lineHeight: [1.5, null, null, 2, null, 2.33],
      color: 'textSecondary',
      maxWidth: [470],
      m: [null, null, null, '30px auto', 0],
      mt: [3, null, null, null, 5],
    },
  },
  subscriptionForm: {
    maxWidth: [null, null, null, 470, 'none'],
    m: [null, null, null, '30px auto', '30px 0 0'],
    mt: [6],
    input: {
      backgroundColor: '#FFFFFF',
      border: '0 none',
      fontFamily: 'body',
      fontSize: [1, null, null, null, 2],
      px: [5],
      boxShadow: '0px 16px 40px rgba(72, 59, 26, 0.08)',
      minHeight: [40, 50, null, null, null, 60],
      /* Chrome, Firefox, Opera, Safari 10.1+ */
      '::placeholder': {
        color: rgba('#02073E', 0.4),
        opacity: 1 /* Firefox */,
      },
    },
    button: {
      fontSize: [0, 1, null, null, 2],
      minHeight: [40, 50, null, null, null, 60],
    },
  },
  bannerImage: {
    alignItems: 'center',
    mt: [9, null, null, null, 0],
    img: {
      maxWidth: [null, null, null, '80%', '100%'],
      m: [null, null, null, '0 auto', 0],
    },
  },
};