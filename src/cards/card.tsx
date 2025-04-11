import { cn } from "../utils"
import {
  CardProps,
  CardHeaderProps,
  CardDescriptionProps,
  CardImageProps,
  //   CardTagsProps,
  LayoutProps,
} from "./types"
import Svg from "@common/svg"

const Card = ({
  children,
  // id,
  onClick,
  url,
  openInNewTab,
  noPadding = false,
}: //   actionMenu,
CardProps) => {
  const cardBaseClasses =
    "relative w-full h-full border border-muted rounded-xl overflow-hidden bg-card group"
  const paddingClasses = url || noPadding ? "" : "p-2 md:p-4"

  return (
    <div
      // id={id}
      // key={id}
      onClick={onClick}
      className={cn(
        cardBaseClasses,
        paddingClasses,
        onClick && "cursor-pointer",
      )}
    >
      {url ? (
        <a
          href={url}
          rel="noreferrer"
          target={openInNewTab ? "_blank" : ""}
          className={noPadding ? "" : "p-2 md:p-2.5 block w-full h-full"}
        >
          {children}
        </a>
      ) : (
        children
      )}

      {/* {actionMenu && (
        <div className="absolute right-0 top-0 opacity-0 group-hover:opacity-100 transition-opacity">
          <ActionMenu {...actionMenu} />
        </div>
      )} */}
    </div>
  )
}

export const CardHeader = ({
  icon,
  header,
  lineClampHeader = 2,
}: //   showTooltipHeader = false,
CardHeaderProps) => {
  if (!header) return
  return (
    // <TooltipWrapper content={header} disabled={!showTooltipHeader}>
    <div className="flex items-center">
      {icon && (
        <div className="mr-2">
          <Svg name={icon} className="h-4 w-4" />
        </div>
      )}
      <p
        className={`text-primary font-semibold text-md line-clamp-${lineClampHeader}`}
      >
        {header}
      </p>
    </div>
    // </TooltipWrapper>
  )
}

export const CardDescription = ({
  description,
  lineClampDescription = 3,
}: CardDescriptionProps) => {
  if (!description) return
  return (
    <div className="flex-grow overflow-hidden">
      <p
        className={`text-secondary text-sm line-clamp-${lineClampDescription}`}
      >
        {description}
      </p>
    </div>
  )
}

export const CardContent = ({
  header,
  lineClampHeader,
  description,
  lineClampDescription,
  //   tags,
  buttons,
}: LayoutProps) => {
  return (
    <div className="flex flex-col h-full gap-2">
      {header && (
        <CardHeader header={header} lineClampHeader={lineClampHeader} />
      )}
      {description && (
        <CardDescription
          description={description}
          lineClampDescription={lineClampDescription}
        />
      )}
      {/* {tags && <CardTags tags={tags} tagSize="xs" />} */}
      {buttons && <div className="mt-3">{buttons}</div>}
    </div>
  )
}

/*
  export const CardBanner = ({ bannerText }: { bannerText: string }) => {
    return <Tag color="muted">{bannerText}</Tag>
  }
  */

export const CardImage = ({
  src,
  //   darkSrc,
  alt = "",
  initials,
  ...rest
}: CardImageProps) => {
  if (src)
    return (
      <img
        src={src}
        // darkSrc={darkSrc}
        alt={alt}
        // fallbackUrl="/images/backupImages/img-placeholder.svg"
        // blurDataURL="/images/backupImages/img-placeholder.svg"
        {...rest}
      />
    )
  //   if (initials) return <InitialsImage char1={initials[0]} char2={initials[1]} />
}

// export const CardTags = ({
//   tags,
//   tagSize,
//   tagColor,
//   ...rest
// }: CardTagsProps) => {
//   return (
//     <Tags {...rest}>
//       {tags.map((tag) => (
//         <Tag key={tag} size={tagSize} color={tagColor}>
//           {tag}
//         </Tag>
//       ))}
//     </Tags>
//   )
// }

export default Card
