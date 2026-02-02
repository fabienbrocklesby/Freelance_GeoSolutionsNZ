import React, { useState, useMemo } from 'react';
import {
  Layout,
  HeaderLayout,
  ContentLayout,
  Box,
  Flex,
  Typography,
  TextInput,
  Accordion,
  AccordionToggle,
  AccordionContent,
  AccordionGroup,
  Link,
  Badge,
  Table,
  Thead,
  Tbody,
  Tr,
  Td,
  Th,
  Divider,
  Alert,
} from '@strapi/design-system';
import { Search } from '@strapi/icons';
import styled from 'styled-components';
import { documentationContent } from '../../content/documentation';

// Styled components for documentation
const DocContainer = styled(Box)`
  max-width: 900px;
  margin: 0 auto;
`;

const Section = styled(Box)`
  scroll-margin-top: 100px;
`;

const SidebarContainer = styled(Box)`
  position: sticky;
  top: 20px;
  max-height: calc(100vh - 140px);
  overflow-y: auto;
`;

const NavItem = styled.button`
  display: block;
  width: 100%;
  padding: 8px 12px;
  text-align: left;
  background: ${({ active, theme }) => (active ? theme.colors.primary100 : 'transparent')};
  border: none;
  border-left: 3px solid ${({ active, theme }) => (active ? theme.colors.primary600 : 'transparent')};
  border-radius: 0 4px 4px 0;
  cursor: pointer;
  color: ${({ active, theme }) => (active ? theme.colors.primary700 : theme.colors.neutral800)};
  font-size: 14px;
  font-weight: ${({ active }) => (active ? '600' : '400')};
  transition: all 0.2s ease;

  &:hover {
    background: ${({ theme }) => theme.colors.primary100};
  }
`;

const SubNavItem = styled(NavItem)`
  padding-left: 24px;
  font-size: 13px;
`;

const HighlightedText = styled.span`
  background: ${({ theme }) => theme.colors.warning200};
  padding: 0 2px;
  border-radius: 2px;
`;

const CodeBlock = styled(Box)`
  background: ${({ theme }) => theme.colors.neutral100};
  border: 1px solid ${({ theme }) => theme.colors.neutral200};
  border-radius: 4px;
  padding: 12px 16px;
  font-family: monospace;
  font-size: 13px;
  overflow-x: auto;
`;

const Tip = styled(Box)`
  background: ${({ theme }) => theme.colors.primary100};
  border-left: 4px solid ${({ theme }) => theme.colors.primary600};
  padding: 12px 16px;
  border-radius: 0 4px 4px 0;
  margin: 16px 0;
`;

const Warning = styled(Box)`
  background: ${({ theme }) => theme.colors.warning100};
  border-left: 4px solid ${({ theme }) => theme.colors.warning600};
  padding: 12px 16px;
  border-radius: 0 4px 4px 0;
  margin: 16px 0;
`;

const ChecklistItem = styled(Flex)`
  padding: 8px 0;
  border-bottom: 1px solid ${({ theme }) => theme.colors.neutral150};

  &:last-child {
    border-bottom: none;
  }
`;

const HomePage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSection, setActiveSection] = useState('getting-started');
  const [expandedSections, setExpandedSections] = useState({});

  // Navigation structure
  const navigation = [
    { id: 'getting-started', label: 'Getting Started', icon: '🚀' },
    { id: 'content-types', label: 'Content Types Overview', icon: '📁' },
    { id: 'editing-content', label: 'How to Edit Content', icon: '✏️' },
    { id: 'image-guidelines', label: 'Image Guidelines', icon: '🖼️' },
    { id: 'seo-best-practices', label: 'SEO Best Practices', icon: '🔍' },
    { id: 'common-tasks', label: 'Common Tasks', icon: '📋' },
    { id: 'troubleshooting', label: 'Troubleshooting', icon: '🔧' },
    { id: 'quick-reference', label: 'Quick Reference', icon: '⚡' },
  ];

  // Filter content based on search
  const filteredContent = useMemo(() => {
    if (!searchQuery.trim()) return documentationContent;

    const query = searchQuery.toLowerCase();
    return documentationContent.filter(
      (section) =>
        section.title.toLowerCase().includes(query) ||
        section.content.toLowerCase().includes(query) ||
        (section.subsections &&
          section.subsections.some(
            (sub) =>
              sub.title.toLowerCase().includes(query) ||
              sub.content.toLowerCase().includes(query)
          ))
    );
  }, [searchQuery]);

  const highlightText = (text, query) => {
    if (!query.trim()) return text;

    const parts = text.split(new RegExp(`(${query})`, 'gi'));
    return parts.map((part, i) =>
      part.toLowerCase() === query.toLowerCase() ? (
        <HighlightedText key={i}>{part}</HighlightedText>
      ) : (
        part
      )
    );
  };

  const scrollToSection = (sectionId) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const toggleAccordion = (id) => {
    setExpandedSections((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <Layout>
      <HeaderLayout
        title="📚 Admin User Guide"
        subtitle="Everything you need to know about managing your GeoSolutions website"
        as="h1"
      />
      <ContentLayout>
        <Flex gap={6} alignItems="flex-start">
          {/* Sidebar Navigation */}
          <Box
            background="neutral0"
            shadow="filterShadow"
            hasRadius
            padding={4}
            style={{ minWidth: '250px' }}
          >
            <SidebarContainer>
              <Box paddingBottom={4}>
                <TextInput
                  placeholder="Search documentation..."
                  name="search"
                  aria-label="Search documentation"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  startAction={<Search aria-hidden />}
                />
              </Box>

              <Divider />

              <Box paddingTop={4}>
                <Typography variant="sigma" textColor="neutral600">
                  NAVIGATION
                </Typography>
                <Box paddingTop={2}>
                  {navigation.map((item) => (
                    <NavItem
                      key={item.id}
                      active={activeSection === item.id}
                      onClick={() => scrollToSection(item.id)}
                    >
                      {item.icon} {item.label}
                    </NavItem>
                  ))}
                </Box>
              </Box>

              {searchQuery && (
                <Box paddingTop={4}>
                  <Badge>
                    {filteredContent.length} result
                    {filteredContent.length !== 1 ? 's' : ''} found
                  </Badge>
                </Box>
              )}
            </SidebarContainer>
          </Box>

          {/* Main Content */}
          <DocContainer background="neutral0" shadow="filterShadow" hasRadius padding={6} style={{ flex: 1 }}>
            {filteredContent.length === 0 ? (
              <Box padding={8} textAlign="center">
                <Typography variant="beta" textColor="neutral600">
                  No results found for "{searchQuery}"
                </Typography>
                <Box paddingTop={2}>
                  <Typography variant="omega" textColor="neutral500">
                    Try searching for different keywords
                  </Typography>
                </Box>
              </Box>
            ) : (
              filteredContent.map((section) => (
                <Section key={section.id} id={section.id} paddingBottom={8}>
                  <Typography variant="alpha" as="h2">
                    {highlightText(section.title, searchQuery)}
                  </Typography>
                  <Box paddingTop={4}>
                    {section.component ? (
                      <section.component
                        highlightText={highlightText}
                        searchQuery={searchQuery}
                        toggleAccordion={toggleAccordion}
                        expandedSections={expandedSections}
                      />
                    ) : (
                      <Typography>{highlightText(section.content, searchQuery)}</Typography>
                    )}
                  </Box>
                  <Divider style={{ marginTop: '32px' }} />
                </Section>
              ))
            )}
          </DocContainer>
        </Flex>
      </ContentLayout>
    </Layout>
  );
};

export default HomePage;
