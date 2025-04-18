// app/utils/pdfUtils.ts
import { Document, Page, Text, View, StyleSheet, Image, pdf } from '@react-pdf/renderer';
import { createTw } from 'react-pdf-tailwind';
import React from 'react';

const tw = createTw({});

// Create custom styles for PDF elements
const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: 'Helvetica',
    position: 'relative',
    // width: '100%',
    // height: '100%',
  },
  fullWidthBanner: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    width: '100vw',
    marginTop: 0,
    marginLeft: -40,
    marginRight: -40,
    // height: 240,
  },
  bannerImage: {
    width: '110%',
    objectFit: 'cover',
    objectPosition: 'top left',
  },
  contentContainer: {
    marginTop: 260,
  },
  header: {
    flexDirection: 'row',
    marginBottom: 20,
    borderBottom: '1px solid #CCCCCC',
    paddingBottom: 10,
  },
  headerLogo: {
    width: 60,
    height: 60,
    marginRight: 15,
  },
  headerTextContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
  },
  instituteName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
  },
  instituteTagline: {
    fontSize: 9,
    color: '#666666',
    marginTop: 2,
  },
  reportTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333333',
  },
  subtitle: {
    fontSize: 10,
    color: '#666666',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 15,
    marginBottom: 5,
    color: '#333333',
  },
  questionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    marginTop: 12,
    marginBottom: 4,
    color: '#333333',
  },
  subsectionTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    marginTop: 8,
    marginBottom: 3,
    color: '#333333',
  },
  normalText: {
    fontSize: 10,
    lineHeight: 1.5,
    marginBottom: 10,
    color: '#333333',
  },
  boldText: {
    fontWeight: 'bold',
  },
  italicText: {
    fontStyle: 'italic',
  },
  bulletPoint: {
    marginLeft: 15,
    fontSize: 10,
    lineHeight: 1.5,
  },
  bulletRow: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  bulletMarker: {
    width: 15,
    fontSize: 10,
  },
  highlightBox: {
    backgroundColor: '#f0f7ff',
    padding: 10,
    borderRadius: 5,
    marginVertical: 10,
  },
  highlightTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#0066CC',
  },
  highlightText: {
    fontSize: 10,
    color: '#333333',
    lineHeight: 1.5,
  },
  transformationSection: {
    backgroundColor: '#f5f0ff',
    padding: 10,
    borderRadius: 5,
    marginVertical: 15,
  },
  phaseTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#6633CC',
    marginBottom: 5,
  },
  phaseContent: {
    marginLeft: 15,
    fontSize: 10,
    color: '#333333',
    lineHeight: 1.5,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
    paddingVertical: 5,
  },
  tableHeader: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#CCCCCC',
    paddingVertical: 5,
    backgroundColor: '#F5F5F5',
  },
  tableCell: {
    flex: 1,
    fontSize: 9,
    padding: 3,
  },
  tableCellHeader: {
    flex: 1,
    fontSize: 9,
    fontWeight: 'bold',
    padding: 3,
  },
});

// Custom Page component with banner
const PageWithBanner = ({ children, size }: { children: React.ReactNode, size: any }) => (
  <Page size="A4" style={styles.page} wrap={false}>
    <View style={styles.fullWidthBanner} fixed>
      <Image
        src="/banner.png"
        style={styles.bannerImage}
        cache={false}
      />
    </View>
    <View style={styles.contentContainer}>
      {children}
    </View>
  </Page>
);

// Function to process text content and handle special formatting
const processText = (text: string) => {
  // Replace emoji placeholders with actual emojis
  let processedText = text
    .replace(/🧠/g, '🧠')
    .replace(/💡/g, '💡')
    .replace(/💎/g, '💎')
    .replace(/📅/g, '📅')
    .replace(/🧭/g, '🧭');
    
  // Remove markdown-style formatting that can't be rendered
  processedText = processedText
    .replace(/\*\*/g, '') // Remove ** markdown for bold
    .replace(/\*/g, '')   // Remove * markdown for italic
    .replace(/\_\_/g, '') // Remove __ markdown for bold
    .replace(/\_/g, '');  // Remove _ markdown for italic
  
  return processedText;
};

// Render text with proper formatting for bold/emphasized sections
const renderFormattedText = (text: string) => {
  if (!text) return null;

  // Process special formatting like bold, italic with React-PDF compatible elements
  const parts = [];
  let currentText = '';
  let inBold = false;
  let inItalic = false;
  
  // Process the text character by character
  for (let i = 0; i < text.length; i++) {
    // Check for bold markdown
    if (i < text.length - 1 && text.substr(i, 2) === '**') {
      if (currentText) {
        parts.push(inBold ? 
          <Text key={parts.length} style={styles.boldText}>{currentText}</Text> : 
          <Text key={parts.length}>{currentText}</Text>
        );
        currentText = '';
      }
      inBold = !inBold;
      i++; // Skip the second *
      continue;
    }
    
    // Check for italic markdown
    if (text[i] === '*') {
      if (currentText) {
        parts.push(inItalic ? 
          <Text key={parts.length} style={styles.italicText}>{currentText}</Text> : 
          <Text key={parts.length}>{currentText}</Text>
        );
        currentText = '';
      }
      inItalic = !inItalic;
      continue;
    }
    
    currentText += text[i];
  }
  
  // Add any remaining text
  if (currentText) {
    parts.push(inBold ? 
      <Text key={parts.length} style={styles.boldText}>{currentText}</Text> : 
      inItalic ? 
        <Text key={parts.length} style={styles.italicText}>{currentText}</Text> : 
        <Text key={parts.length}>{currentText}</Text>
    );
  }
  
  return parts.length ? <Text>{parts}</Text> : null;
};

const parseSection = (section: string, index: number | string) => {
  // Clean the section of any markdown-style formatting if needed
  const cleanSection = section.replace(/^\s*[\*_]+\s*|\s*[\*_]+\s*$/g, '');
  
  // Bullet points
  if (cleanSection.trim().startsWith('●')) {
    return (
      <View key={index} style={styles.bulletRow}>
        <Text style={styles.bulletMarker}>●</Text>
        <Text style={styles.bulletPoint}>
          {processText(cleanSection.replace('●', '').trim())}
        </Text>
      </View>
    );
  }

  // Markdown-style bullet points
  if (cleanSection.trim().startsWith('-')) {
    return (
      <View key={index} style={styles.bulletRow}>
        <Text style={styles.bulletMarker}>•</Text>
        <Text style={styles.bulletPoint}>
          {processText(cleanSection.replace('-', '').trim())}
        </Text>
      </View>
    );
  }
  
  // Check if it's a phase section
  if (cleanSection.trim().startsWith('🧠 Phase')) {
    const lines = cleanSection.split('\n');
    const phaseTitle = lines[0];
    const phaseContent = lines.slice(1).join('\n');
    
    return (
      <View key={index} style={{ marginBottom: 10 }}>
        <Text style={styles.phaseTitle}>{processText(phaseTitle)}</Text>
        <Text style={styles.phaseContent}>{processText(phaseContent)}</Text>
      </View>
    );
  }
  
  // Check if it's a highlight section
  if (cleanSection.includes('💡 What the Neuro Change Method™ Can Do for You') ||
    cleanSection.includes('💎 Why Now, Why You, and Why a Neuro Change Practitioner?')) {
    const parts = cleanSection.split('\n');
    const title = parts[0];
    const content = parts.slice(1).join('\n');
    
    return (
      <View key={index} style={styles.highlightBox}>
        <Text style={styles.highlightTitle}>{processText(title)}</Text>
        <Text style={styles.highlightText}>{processText(content)}</Text>
      </View>
    );
  }
  
  // Check if it's a client response section
  if (cleanSection.startsWith('Client Response:')) {
    return (
      <View key={index} style={{ marginBottom: 8, marginLeft: 10 }}>
        <Text style={styles.italicText}>{processText(cleanSection)}</Text>
      </View>
    );
  }

  // Check if it's a DreamScape AI insight section
  if (cleanSection.startsWith('DreamScape AI Insight:')) {
    const parts = cleanSection.split('\n');
    const title = parts[0];
    const content = parts.slice(1).join('\n');

    return (
      <View key={index} style={{ marginBottom: 15 }}>
        <Text style={styles.subsectionTitle}>{processText(title)}</Text>
        <Text style={styles.normalText}>{processText(content)}</Text>
      </View>
    );
  }

  // Check if it's a main section title
  if (cleanSection.startsWith('Client Summary') ||
    cleanSection.startsWith('Primary Objective:') ||
    cleanSection.startsWith('Key Barriers:') ||
    cleanSection.startsWith('Transformation Theme:') ||
    cleanSection.startsWith('Projected Transformation Outcomes') ||
    cleanSection.startsWith('Practitioner Notes')) {
    const lines = cleanSection.split('\n');
    const title = lines[0];
    const content = lines.slice(1).join('\n');
    
    return (
      <View key={index} style={{ marginBottom: 10 }}>
        <Text style={styles.sectionTitle}>{processText(title)}</Text>
        <Text style={styles.normalText}>{processText(content)}</Text>
      </View>
    );
  }

  // Check if it's a question (numeric prefix)
  if (/^\d+\.\s/.test(cleanSection)) {
    const lines = cleanSection.split('\n');
    const title = lines[0];
    const content = lines.slice(1).join('\n');

    return (
      <View key={index} style={{ marginBottom: 10 }}>
        <Text style={styles.questionTitle}>{processText(title)}</Text>
        <Text style={styles.normalText}>{processText(content)}</Text>
      </View>
    );
  }
  
  // Default case - regular paragraph
  return (
    <Text key={index} style={styles.normalText}>
      {processText(cleanSection)}
    </Text>
  );
};

// Build a milestone table if present in the content
const buildMilestoneTable = (sections: string[]) => {
  const milestoneSection = sections.find((s: string) => s.includes('12-Week Milestone Map'));
  
  if (!milestoneSection) return null;
  
  // Extract table content from the section
  const tableLines = milestoneSection.split('\n').slice(1);
  
  // Find where table header is
  const headerIndex = tableLines.findIndex((line: string) =>
    line.includes('Milestone') && line.includes('Target Week') && line.includes('Tools & Focus'));
  
  if (headerIndex === -1) return null;
  
  // Extract and format table data
  const tableData = tableLines.slice(headerIndex + 1)
    .filter((line: string) => line.trim() !== '')
    .map((line: string) => {
      const parts = line.split('|');
      if (parts.length < 3) return [line.trim(), '', ''];
      return [parts[0].trim(), parts[1].trim(), parts[2].trim()];
    });

  return (
    <View style={{ marginVertical: 15 }}>
      <Text style={styles.sectionTitle}>12-Week Milestone Map</Text>
      <View style={styles.tableHeader}>
        <Text style={styles.tableCellHeader}>Milestone</Text>
        <Text style={styles.tableCellHeader}>Target Week</Text>
        <Text style={styles.tableCellHeader}>Tools & Focus</Text>
      </View>
      {tableData.map((row: string[], i: number) => (
        <View key={i} style={styles.tableRow}>
          <Text style={styles.tableCell}>{processText(row[0])}</Text>
          <Text style={styles.tableCell}>{processText(row[1])}</Text>
          <Text style={styles.tableCell}>{processText(row[2])}</Text>
        </View>
      ))}
    </View>
  );
};

// Split content into pages with better control over section breaks
const splitContentIntoPages = (sections: string[], maxSectionsPerPage: number = 6) => {
  const pages = [];
  let currentPage = [];
  let currentLength = 0;
  const MAX_LENGTH_PER_PAGE = 2500; // Approximate character limit per page
  
  for (const section of sections) {
    // Check if this is a large section that might need special handling
    const sectionLength = section.length;
    
    // If the current section is very large or current page is getting full, start a new page
    if ((currentLength > 0 && (currentLength + sectionLength > MAX_LENGTH_PER_PAGE)) || 
        currentPage.length >= maxSectionsPerPage) {
      pages.push([...currentPage]);
      currentPage = [];
      currentLength = 0;
    }
    
    // Special handling for very large sections that should be on their own page
    if (sectionLength > MAX_LENGTH_PER_PAGE) {
      // If we have content waiting to be added to a page, add it first
      if (currentPage.length > 0) {
        pages.push([...currentPage]);
        currentPage = [];
        currentLength = 0;
      }
      
      // Add the large section as its own page
      pages.push([section]);
      continue;
    }
    
    // Add normal section to current page
    currentPage.push(section);
    currentLength += sectionLength;
  }
  
  // Add any remaining sections
  if (currentPage.length > 0) {
    pages.push(currentPage);
  }
  
  return pages;
};

export const generateClientPDF = async (firstName: string, clientSections: string[]) => {
  // Split content into pages
  const contentPages = splitContentIntoPages(clientSections);
  
  const ClientPDF = (
    <Document>
      <PageWithBanner size="A4">
        <Text style={styles.reportTitle}>Client Assessment Report for {firstName}</Text>
        <Text style={styles.subtitle}>Prepared by DreamScape AI</Text>

        {contentPages[0]?.map((section, index) =>
          parseSection(section, `client_first_page_${index}`)
        )}
      </PageWithBanner>
      
      {contentPages.slice(1).map((pageSections, pageIndex) => (
        <PageWithBanner key={`client_page_${pageIndex + 1}`} size="A4">
          {pageSections.map((section, sectionIndex) =>
            parseSection(section, `client_page${pageIndex + 1}_section${sectionIndex}`)
          )}
        </PageWithBanner>
      ))}
    </Document>
  );

  return await pdf(ClientPDF).toBlob();
};

export const generatePractitionerPDF = async (firstName: string, practitionerSections: string[]) => {
  // Find milestone table section and remove it from the main content
  const milestoneTableIndex = practitionerSections.findIndex(s => s.includes('12-Week Milestone Map'));
  let milestoneTableSection = null;
  
  if (milestoneTableIndex !== -1) {
    milestoneTableSection = practitionerSections[milestoneTableIndex];
    practitionerSections = [
      ...practitionerSections.slice(0, milestoneTableIndex),
      ...practitionerSections.slice(milestoneTableIndex + 1)
    ];
  }
  
  // Ensure reasonable page breaks
  const contentPages = splitContentIntoPages(practitionerSections, 5); // Fewer sections per page for practitioner
  
  // Add milestone table to its own page at the end
  if (milestoneTableSection) {
    contentPages.push([milestoneTableSection]);
  }
  
  const PractitionerPDF = (
    <Document>
      <PageWithBanner size="A4">
        <Text style={styles.reportTitle}>🧭 Practitioner Case Report: {firstName}</Text>
        
        {contentPages[0]?.map((section, index) =>
          parseSection(section, `prac_first_page_${index}`)
        )}
      </PageWithBanner>
      
      {contentPages.slice(1).map((pageSections, pageIndex) => (
        <PageWithBanner key={`prac_page_${pageIndex + 1}`} size="A4">
          {pageSections.map((section, sectionIndex) => {
            // Special handling for milestone table
            if (section === milestoneTableSection) {
              return buildMilestoneTable([section]);
            }
            return parseSection(section, `prac_page${pageIndex + 1}_section${sectionIndex}`);
          })}
        </PageWithBanner>
      ))}
    </Document>
  );

  return await pdf(PractitionerPDF).toBlob();
};