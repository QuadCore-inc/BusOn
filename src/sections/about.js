/** @jsx jsx */
import { jsx, Box, Container, Flex, Heading, Text, Image, Link } from 'theme-ui';
import jvictorferreira from '../assets/images/jvictorferreira.jpeg';
import joel from '../assets/images/joel.jpeg';
import kauan from '../assets/images/kauan.jpeg';
import marco from '../assets/images/marco.jpeg';
import linkedinIcon from '../assets/images/icons/linkedin.png';
import githubIcon from '../assets/images/icons/github.png';

const teamMembers = [
  {
    name: "João Ferreira",
    role: "Frontend Developer",
    imageSrc: jvictorferreira,
    linkedin: "https://www.linkedin.com/in/jvictorferreira3301/",
    github: "https://github.com/jvictorferreira3301",
  },
  {
    name: "Joel Tavares",
    role: "Gerente de Projeto",
    imageSrc: joel,
    linkedin: "https://www.linkedin.com/in/joel-miranda-365649236/",
    github: "https://github.com/JoeMiran",
  },
  {
    name: "Kauan Miranda",
    role: "Backend Developer",
    imageSrc: kauan,
    linkedin: "https://www.linkedin.com/in/kauan-miranda-a6a5ba298/",
    github: "https://github.com/kkauanjjk",
  },
  {
    name: "Marco Maués",
    role: "Backend Developer",
    imageSrc: marco,
    linkedin: "https://www.linkedin.com/in/marcomaues/",
    github: "https://github.com/Mauesjr",
  },
];

const AboutUs = () => {
  return (
    <section id="about" sx={styles.section}>
      <Container>
        <Heading as="h2" sx={styles.heading}>Sobre Nós</Heading>
        <Flex sx={styles.grid}>
          {teamMembers.map((member, index) => (
            <Box key={index} sx={styles.card}>
              <Image src={member.imageSrc} alt={member.name} sx={styles.image} />
              <Box sx={styles.content}>
                <Heading as="h3" sx={styles.name}>{member.name}</Heading>
                <Text sx={styles.role}>{member.role}</Text>
                <Text sx={styles.description}>{member.description}</Text>
                <Flex sx={styles.badges}>
                  <Link href={member.linkedin} target="_blank" sx={styles.linkedin}>
                    <Image src={linkedinIcon} alt="LinkedIn" sx={styles.linkedinIcon} />
                  </Link>
                  <Link href={member.github} target="_blank" sx={styles.github}>
                    <Image src={githubIcon} alt="GitHub" sx={styles.githubIcon} />
                  </Link>
                </Flex>
              </Box>
            </Box>
          ))}
        </Flex>
      </Container>
      </section>
  );
};

export default AboutUs;

const styles = {
  section: {
    backgroundColor: '#FFFFFF', // Alterado para branco
    pt: [9, null, null, 11, 10, 12, null],
    pb: [9, null, null, null, 0],
  },
  heading: {
    textAlign: 'center',
    mb: [6, null, null, 8],
    fontSize: [5, null, null, 6],
    color: '#333',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: ['repeat(1, 1fr)', null, 'repeat(2, 1fr)', 'repeat(4, 1fr)'],
    gap: [6, null, null, 8],
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 8,
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    overflow: 'hidden',
    textAlign: 'center',
    p: [4, null, null, 5],
  },
  image: {
    borderRadius: '50%',
    width: '150px',
    height: '150px',
    objectFit: 'cover',
    mb: 4,
  },
  content: {
    textAlign: 'center',
  },
  name: {
    fontSize: [3, null, null, 4],
    color: '#333',
    mb: 2,
  },
  role: {
    fontSize: [2, null, null, 3],
    color: 'primary',
    mb: 2,
  },
  description: {
    fontSize: [1, null, null, 2],
    color: '#666',
    mb: 3,
  },
  badges: {
    justifyContent: 'center',
    mt: 2,
  },
  linkedin: {
    display: 'inline-block',
    mx: 2,
  },
  linkedinIcon: {
    width: '24px',
    height: '24px',
  },
  github: {
    display: 'inline-block',
    mx: 2,
  },
  githubIcon: {
    width: '24px',
    height: '24px',
  },
};