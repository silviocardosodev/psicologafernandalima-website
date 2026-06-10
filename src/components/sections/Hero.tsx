"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

import styles from "./Hero.module.css";

export function Hero() {
  return (
    <section id="inicio" className={styles["fernanda-hero"]}>
      <div className={styles["fernanda-hero__ambient"]}>
        <div
          className={`${styles["fernanda-hero__glow"]} ${styles["fernanda-hero__glow--purple"]}`}
        />
        <div
          className={`${styles["fernanda-hero__glow"]} ${styles["fernanda-hero__glow--blue"]}`}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.65, ease: "easeOut" }}
        className={styles["fernanda-hero__panel"]}
      >
        <div className={styles["fernanda-hero__content"]}>
          <h1 className={styles["fernanda-hero__title"]}>
            Você não precisa carregar tudo sozinha
          </h1>

          <p className={styles["fernanda-hero__description"]}>
            Um espaço seguro para olhar para si mesma com mais gentileza,
            clareza e acolhimento.
          </p>

          <div className={styles["fernanda-hero__actions"]}>
            <Link
              href="#agendar"
              className={`${styles["fernanda-hero__action"]} ${styles["fernanda-hero__action--primary"]}`}
            >
              Agendar sessão
              <ArrowRight className={styles["fernanda-hero__action-icon"]} />
            </Link>

            <Link
              href="#para-quem-e"
              className={`${styles["fernanda-hero__action"]} ${styles["fernanda-hero__action--secondary"]}`}
            >
              Conheça meu trabalho
            </Link>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut", delay: 0.12 }}
          className={styles["fernanda-hero__media"]}
        >
          <div className={styles["fernanda-hero__photo-block"]}>
            <div className={styles["fernanda-hero__photo-frame"]}>
              <div className={styles["fernanda-hero__photo-viewport"]}>
                <Image
                  src="/psicologa-fernanda-lima.png"
                  alt="Fernanda Lima, psicóloga"
                  fill
                  priority
                  className={styles["fernanda-hero__photo"]}
                  sizes="(max-width: 1024px) 100vw, 640px"
                />
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
