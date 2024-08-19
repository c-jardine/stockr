import {
  Container,
  ContainerProps,
  Heading,
  HeadingProps,
  HStack,
  StackProps,
  useColorModeValue,
} from "@chakra-ui/react";
import React from "react";

interface PageHeaderContentProps extends StackProps {
  children: React.ReactNode;
}

function PageHeaderContent({ children, ...props }: PageHeaderContentProps) {
  return <HStack gap={4} {...props}>{children}</HStack>;
}

interface PageHeaderTitleProps extends HeadingProps {
  children: React.ReactNode;
}

function PageHeaderTitle({ children, ...props }: PageHeaderTitleProps) {
  return (
    <Heading as="h1" flexGrow={1} {...props}>
      {children}
    </Heading>
  );
}

interface PageHeaderProps extends ContainerProps {
  children: React.ReactNode;
}

export default function PageHeader({ children, ...props }: PageHeaderProps) {
  const bgColor = useColorModeValue("white", "zinc.900");
  const borderColor = useColorModeValue("zinc.200", "zinc.800");

  return (
    <Container
      p={4}
      rounded="2xl"
      maxW="full"
      bg={bgColor}
      border="1px"
      borderColor={borderColor}
      {...props}
    >
      {children}
    </Container>
  );
}

PageHeader.Content = PageHeaderContent;
PageHeader.Title = PageHeaderTitle;
