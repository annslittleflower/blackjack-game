import { ComponentPropsWithoutRef } from 'react'

import styles from './CardImage.module.css'

type CardImageProps = ComponentPropsWithoutRef<'img'>

const CardImage = (props: CardImageProps) => (
  <img
    {...props}
    className={styles.cardImage}
  />
)

export default CardImage
