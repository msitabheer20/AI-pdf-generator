// app/utils/pdfUtils.ts
import { Document, Page, Text, View, StyleSheet, Image, pdf } from '@react-pdf/renderer';
import { createTw } from 'react-pdf-tailwind';

const tw = createTw({});

// Create custom styles for PDF elements
const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: 'Helvetica',
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
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 5,
    color: '#333333',
  },
  subtitle: {
    fontSize: 10,
    color: '#666666',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    marginTop: 15,
    marginBottom: 5,
    color: '#333333',
  },
  normalText: {
    fontSize: 10,
    lineHeight: 1.5,
    marginBottom: 10,
    color: '#333333',
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
    fontSize: 11,
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
    fontSize: 11,
    fontWeight: 'bold',
    color: '#6633CC',
    marginBottom: 3,
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

// Function to process text content and handle special formatting
const processText = (text: string) => {
  // Replace emoji placeholders with actual emojis
  const withEmojis = text
    .replace(/🧠/g, '🧠')
    .replace(/💡/g, '💡')
    .replace(/💎/g, '💎')
    .replace(/📅/g, '📅')
    .replace(/🧭/g, '🧭');
    
  return withEmojis;
};

// Function to parse a section into appropriate React PDF components
const parseSection = (section: string, index: number) => {
  // Check if it's a bullet point
  if (section.trim().startsWith('●')) {
    return (
      <View key={index} style={styles.bulletRow}>
        <Text style={styles.bulletMarker}>●</Text>
        <Text style={styles.bulletPoint}>{section.replace('●', '').trim()}</Text>
      </View>
    );
  }
  
  // Check if it's a phase section (in practitioner report)
  if (section.trim().startsWith('🧠 Phase')) {
    const lines = section.split('\n');
    const phaseTitle = lines[0];
    const phaseContent = lines.slice(1).join('\n');
    
    return (
      <View key={index} style={{ marginBottom: 10 }}>
        <Text style={styles.phaseTitle}>{processText(phaseTitle)}</Text>
        <Text style={styles.phaseContent}>{processText(phaseContent)}</Text>
      </View>
    );
  }
  
  // Check if it's a highlight section (like "What Neuro Change Method Can Do For You")
  if (section.includes('💡 What the Neuro Change Method™ Can Do for You') || 
      section.includes('💎 Why Now, Why You, and Why a Neuro Change Practitioner?')) {
    const parts = section.split('\n');
    const title = parts[0];
    const content = parts.slice(1).join('\n');
    
    return (
      <View key={index} style={styles.highlightBox}>
        <Text style={styles.highlightTitle}>{processText(title)}</Text>
        <Text style={styles.highlightText}>{processText(content)}</Text>
      </View>
    );
  }
  
  // Check if it's a section title (like "Client Summary" or numbered questions)
  if (section.startsWith('Client Summary') || 
      section.startsWith('Primary Objective:') || 
      section.startsWith('Key Barriers:') || 
      section.startsWith('Transformation Theme:') ||
      /^\d+\.\s/.test(section)) {
    const lines = section.split('\n');
    const title = lines[0];
    const content = lines.slice(1).join('\n');
    
    return (
      <View key={index} style={{ marginBottom: 10 }}>
        <Text style={styles.sectionTitle}>{processText(title)}</Text>
        <Text style={styles.normalText}>{processText(content)}</Text>
      </View>
    );
  }
  
  // Default case - regular paragraph
  return (
    <Text key={index} style={styles.normalText}>
      {processText(section)}
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
    <View style={{ marginVertical: 10 }}>
      <Text style={styles.sectionTitle}>12-Week Milestone Map</Text>
      <View style={styles.tableHeader}>
        <Text style={styles.tableCellHeader}>Milestone</Text>
        <Text style={styles.tableCellHeader}>Target Week</Text>
        <Text style={styles.tableCellHeader}>Tools & Focus</Text>
      </View>
      {tableData.map((row: string[], i: number) => (
        <View key={i} style={styles.tableRow}>
          <Text style={styles.tableCell}>{row[0]}</Text>
          <Text style={styles.tableCell}>{row[1]}</Text>
          <Text style={styles.tableCell}>{row[2]}</Text>
        </View>
      ))}
    </View>
  );
};

export const generateClientPDF = async (firstName: string, clientSections: string[]) => {
  const ClientPDF = (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Image 
            src="/neurochange-logo.png" 
            style={styles.headerLogo}
            cache={false}
          />
          <View style={styles.headerTextContainer}>
            <Text style={styles.instituteName}>THE NEURO CHANGE INSTITUTE</Text>
            <Text style={styles.instituteTagline}>
              Offering Evidence-based Accreditation Training for a New Class of Practitioners
            </Text>
          </View>
        </View>

        <Text style={styles.reportTitle}>Client Assessment Report for {firstName}</Text>
        <Text style={styles.subtitle}>Prepared by DreamScape AI</Text>

        {clientSections.map((section, index) => 
          parseSection(section, index)
        )}
      </Page>
    </Document>
  );

  return await pdf(ClientPDF).toBlob();
};

export const generatePractitionerPDF = async (firstName: string, practitionerSections: string[]) => {
  const PractitionerPDF = (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Image 
            src="/neurochange-logo.png" 
            style={styles.headerLogo}
            cache={false}
          />
          <View style={styles.headerTextContainer}>
            <Text style={styles.instituteName}>THE NEURO CHANGE INSTITUTE</Text>
            <Text style={styles.instituteTagline}>
              Offering Evidence-based Accreditation Training for a New Class of Practitioners
            </Text>
          </View>
        </View>

        <Text style={styles.reportTitle}>🧭 Practitioner Case Report: {firstName}</Text>
        
        {practitionerSections.map((section, index) => 
          parseSection(section, index)
        )}
        
        {buildMilestoneTable(practitionerSections)}
      </Page>
    </Document>
  );

  return await pdf(PractitionerPDF).toBlob();
};