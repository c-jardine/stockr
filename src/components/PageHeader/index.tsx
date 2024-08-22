import {
  type ContainerProps,
  Heading,
  type HeadingProps,
  HStack,
  type StackProps,
} from "@chakra-ui/react";
import React from "react";
import Section from "../Section";

interface PageHeaderContentProps extends StackProps {
  children: React.ReactNode;
}

function PageHeaderContent({ children, ...props }: PageHeaderContentProps) {
  return (
    <HStack gap={4} {...props}>
      {children}
    </HStack>
  );
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
  return <Section {...props}>{children}</Section>;
}

PageHeader.Content = PageHeaderContent;
PageHeader.Title = PageHeaderTitle;
