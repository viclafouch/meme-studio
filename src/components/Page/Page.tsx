import { Box } from '@styled-system/jsx'

export type PageProps = {
  children: React.ReactNode
  className?: string
}

const Page = ({ children, className = '' }: PageProps) => {
  return (
    <Box
      flex="1"
      display="flex"
      width="full"
      flexDir="column"
      className={className}
    >
      {children}
    </Box>
  )
}

export default Page
