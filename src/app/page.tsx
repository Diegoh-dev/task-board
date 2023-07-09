import Image from 'next/image';
import styles from './page.module.scss';
import hero from '../../public/assets/hero.png';
import { Roboto } from 'next/font/google';

const roboto = Roboto({weight:['400','500','700'],subsets:['latin']})

export default function Home() {
  return (
    <main className={`${roboto.className} ${styles.main}`}>
      <div className={styles.containerHero}>
        <Image
        className={styles.heroImage}
        src={hero}
        alt='hero'
        priority
       
        />

        <h1>Sistema feito para você organizar <br/> seus estudos e tarefas.</h1>

        <div className={styles.containerSection}>
        <section className={styles.sectionsDados}>
          +7mil posts
        </section>
        <section className={styles.sectionsDados}>
          +1mil comentários
        </section>
      </div>
      </div>

    
    </main>
  )
}
