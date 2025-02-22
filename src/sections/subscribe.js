/** @jsx jsx */
import { jsx, Box, Container } from 'theme-ui';
import { rgba } from 'polished';
import SectionHeading from 'components/section-heading';
import SubscriptionForm from 'components/subscription-form';

const Subscribe = () => {
  return (
    <section id="subscribe" sx={styles.section}>
      <Container>
        <SectionHeading
          sx={styles.heading}
          title="Inscreva-se para ser notificado sobre a atualização"
          description="Ao se inscrever com seu e-mail, você aceitará nossa política de privacidade"
        />
        <SubscriptionForm sx={styles.subscriptionForm} />
      </Container>
      </section>
  );
};

export default Subscribe;

const styles = {
  section: {
    backgroundColor: '#FFFFFF', // Alterado para branco
    pt: [9, null, null, null, 10, 13, null],
    pb: [9, null, null, null, 11, 14, null],
  },
  heading: {
    mb: [7, null, null, 8, 9, 10],
    h2: {
      color: '#000000', // Alterado para preto
      fontSize: [6, null, null, 8],
    },
    p: {
      color: '#858B91',
      fontSize: [2, null, null, 3],
      m: ['15px auto 0', null, null, '10px auto 0'],
    },
  },
  subscriptionForm: {
    m: ['30px auto 0'],
    maxWidth: [555],
    flexDirection: ['column', null, null, 'row'],
    input: {
      backgroundColor: rgba('#000000', 0.08), // Alterado para preto com opacidade
      border: '0 none',
      color: rgba('#000000', 0.8), // Alterado para preto com opacidade
      fontFamily: 'body',
      px: [5],
      minHeight: [50, null, null, null, 60],
      boxShadow: '0px 16px 40px rgba(72, 59, 26, 0.08)',
      /* Chrome, Firefox, Opera, Safari 10.1+ */
      '::placeholder': {
        color: rgba('#000000', 0.8), // Alterado para preto com opacidade
        opacity: 1 /* Firefox */,
      },
    },
    button: {
      fontSize: [1, null, null, 2],
      minHeight: [50, null, null, null, 60],
      ml: [0, null, null, 3],
      mt: [4, null, null, 0],
    },
  },
};