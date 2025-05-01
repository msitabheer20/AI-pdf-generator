import { Document, Page, Text, View, StyleSheet, Image, pdf, Font } from '@react-pdf/renderer';
import React from 'react';

const BulbIcon = () => (
  <Image src="/assets/bulb.png" style={{ width: 16, height: 16 }} />
);

const DiamondIcon = () => (
  <Image src="/assets/diamond.png" style={{ width: 16, height: 16 }} />
);

const CalendarIcon = () => (
  <Image src="/assets/calendar.png" style={{ width: 14, height: 14 }} />
);

const BrainIcon = () => (
  <Image src="/assets/brain.png" style={{ width: 18, height: 18 }} />
);

const CompassIcon = () => (
  <Image src="/assets/compass.png" style={{ width: 18, height: 18 }} />
);

const PencilIcon = () => (
  <Image src="/assets/pencil.png" style={{ width: 16, height: 16 }} />
);

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: 'Times-Roman',
    position: 'relative',
  },
  fullWidthBanner: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    width: '100%',
    height: 240,
  },
  bannerImage: {
    width: '100%',
    objectFit: 'cover',
    objectPosition: 'top left',
  },
  fixedHeader: {
    height: 240,
  },
  contentContainer: {
    width: '100%',
    position: 'relative',
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
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
  },
  instituteTagline: {
    fontSize: 11,
    color: '#000000',
    marginTop: 2,
  },
  reportTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
  },
  subtitle: {
    fontSize: 12,
    color: '#000000',
    marginBottom: 15,
    marginTop: 15,
    fontStyle: 'italic',
  },
  openingStatement: {
    fontSize: 12,
    color: '#000000',
    marginBottom: 15,
    lineHeight: 1.6,
    fontWeight: 'bold',
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 10,
    color: '#000000',
  },
  questionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 12,
    marginBottom: 8,
    color: '#000000',
  },
  subsectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    marginTop: 8,
    marginBottom: 4,
    color: '#000000',
  },
  normalText: {
    fontSize: 12,
    marginBottom: 10,
    color: '#000000',
  },
  boldText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#000000',
  },
  italicText: {
    fontSize: 12,
    fontStyle: 'italic',
    color: '#000000',
  },
  bulletPoint: {
    marginLeft: 10,
    fontSize: 12,
    lineHeight: 1.4,
    color: '#000000',
  },
  bulletRow: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  bulletMarker: {
    width: 18,
    fontSize: 16,
  },
  highlightBox: {
    padding: 10,
    borderRadius: 5,
    marginVertical: 10,
  },
  highlightTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#000000',
  },
  highlightText: {
    fontSize: 12,
    color: '#000000',
    lineHeight: 1.6,
  },
  transformationSection: {
    backgroundColor: '#f5f0ff',
    padding: 10,
    borderRadius: 5,
    marginVertical: 15,
  },
  phaseTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 5,
  },
  phaseItem: {
    marginLeft: 15,
    fontSize: 12,
    lineHeight: 1.6,
    marginBottom: 2,
    color: '#000000',
  },
  phaseContent: {
    marginLeft: 15,
    fontSize: 12,
    color: '#000000',
    lineHeight: 1.6,
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
    backgroundColor: '#E5E5E5',
  },
  tableCell: {
    flex: 1,
    fontSize: 11,
    padding: 4,
    color: '#000000',
  },
  tableCellHeader: {
    flex: 1,
    fontSize: 11,
    fontWeight: 'bold',
    padding: 4,
    color: '#000000',
  },
  titleContainer: {
    marginBottom: 20,
    paddingBottom: 5,
  },
  sectionSeparator: {
    borderBottom: '1px solid #7d7c7c',
    marginVertical: 15,
    width: '100%',
  },
  closingSection: {
    marginTop: 15,
    fontSize: 12,
    lineHeight: 1.6,
    // fontStyle: 'italic',
    color: '#000000',
    padding: 10,
    borderRadius: 5,
  }
});

// Clean text to fix character encoding issues
const cleanText = (text: string): string => {
  if (!text) return '';

  // Replace problematic characters and HTML entities
  return text
    .replace(/[""]/g, '"')
    .replace(/['']/g, "'")
    .replace(/[–—]/g, '-')
    .replace(/[•]/g, '•')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&trade;/g, "™")
    .replace(/&reg;/g, "®")
    .replace(/&copy;/g, "©")
    .replace(/[^\x00-\x7F]/g, char => {
      // For any non-ASCII character, try to replace with ASCII equivalent when possible
      // or remove if can't be safely replaced
      switch (char) {
        case '…': return '...';
        case '™': return 'TM';
        case '©': return '(c)';
        case '®': return '(R)';
        case '°': return 'deg';
        case '€': return 'EUR';
        case '£': return 'GBP';
        case '¥': return 'JPY';
        case '½': return '1/2';
        case '¼': return '1/4';
        case '¾': return '3/4';
        case '∞': return 'infinity';
        case '±': return '+/-';
        case '≤': return '<=';
        case '≥': return '>=';
        case '÷': return '/';
        case '×': return 'x';
        default: return ' '; // Replace unknown special characters with a space
      }
    });
};

const SectionSeparator = () => (
  <View style={styles.sectionSeparator} />
);

const PageBreak = () => (
  <View break />
);

type MilestoneItem = {
  milestone: string;
  targetWeek: string;
  toolsAndFocus: string;
};

type QuestionData = {
  title: string;
  clientResponse: string;
  aiInsight?: string;
  aiInsights?: string[];
  type?: string;
};

type HighlightData = {
  title: string;
  content: string;
  points?: Record<string, string>;
  closingStatement?: string;
};

type PhaseData = {
  title: string;
  items: {
    focus?: string;
    tools?: string;
    goal?: string;
  };
};

type SectionData = {
  type: string;
  title: string;
  content?: string;
  items?: string[];
  primaryObjective?: string;
  phases?: PhaseData[];
  'sub-title'?: string;
  reason?: string;
};

type ClientReport = {
  'question-section'?: QuestionData[];
  'highlight-section'?: HighlightData;
  'closing-section'?: Array<{ content: string }>;
  // Added for direct frontend data support
  clientResponses?: { [key: string]: string };
};

type PractitionerReport = {
  header?: {
    title?: string;
  };
  sections?: Array<{
    type: string;
    title: string;
    content?: string;
    items?: string[];
    primaryObjective?: string;
    phases?: PhaseData[];
  }>;
  milestones?: Array<{
    milestone: string;
    targetWeek: string;
    toolsAndFocus: string;
  }>;
  projectedTransformationOutcomes?: string[];
  closingStatement?: string;
  practitionerNotes?: {
    temperament?: string;
    "best-practices"?: string[];
  };
};

// Format camelCase to Title Case (e.g., "identityReinforcement" -> "Identity Reinforcement")
const formatToolName = (camelCaseText: string): string => {
  if (!camelCaseText) return '';
  
  // First, add spaces before capital letters
  const withSpaces = camelCaseText.replace(/([A-Z])/g, ' $1');
  
  // Capitalize the first letter and trim any leading space
  return withSpaces.charAt(0).toUpperCase() + withSpaces.slice(1).trim();
};

// Render client response and AI insight
const renderQuestionSection = (questionData: QuestionData, key: string | number) => (
  <View key={key} style={{ marginBottom: 10 }} wrap>
    <Text style={styles.questionTitle}>{parseTrademarks(questionData.title)}</Text>
    <View style={{ marginBottom: 8 }} wrap>
      <Text style={styles.boldText}>Client Response:</Text>
      <Text style={{ ...styles.italicText, marginTop: 8 }}>{parseTrademarks(questionData.clientResponse)}</Text>
    </View>
    <View style={{ marginBottom: 8 }} wrap>
      <Text style={styles.subsectionTitle}>DreamScape AI Reflection:</Text>
      {questionData.aiInsights && questionData.aiInsights.length > 0 ? (
        questionData.aiInsights.map((paragraph, idx) => (
          <Text key={`insight_${idx}`} style={{...styles.normalText, marginBottom: 8}}>{parseTrademarks(paragraph)}</Text>
        ))
      ) : (
        <Text style={styles.normalText}>{parseTrademarks(questionData.aiInsight || '')}</Text>
      )}
    </View>
  </View>
);

// Render highlight section with points
const renderHighlightSection = (highlightData: HighlightData, key: string | number) => (
  <View key={key} style={styles.highlightBox} wrap>
    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 5 }} wrap={false}>
      <BulbIcon />
      <Text style={{ ...styles.highlightTitle, marginLeft: 4 }}>{parseTrademarks(highlightData.title)}</Text>
    </View>
    <Text style={styles.highlightText}>{parseTrademarks(highlightData.content)}</Text>

    {highlightData.points && (
      <>
        <Text style={{ ...styles.normalText, marginTop: 8, marginBottom: 8 }}>
          Under the care of a Certified Neuro Change Practitioner, you'll be guided through a precision-based, science-backed transformation that uses:
        </Text>
        {Object.entries(highlightData.points).map(([pointKey, pointValue], idx) => {
          // Extract the actual content if the key has a format like "item1", "item2", etc.
          // But preserve the key if it's already a proper tool name
          const isGenericKey = pointKey.match(/^item\d+$/);
          const cleanKey = isGenericKey 
            ? '' 
            : formatToolName(pointKey
                .replace(/^•?\s*/, '')      // Remove any bullet prefix
                .replace(/:\s*$/, ''));      // Remove trailing colon
          
          return (
            <View key={`${key}_point_${idx}`} style={styles.bulletRow}>
              <Text style={{ ...styles.bulletMarker, fontWeight: 'bold' }}>•</Text>
              <Text style={styles.bulletPoint}>
                {cleanKey ? (
                  <>
                    <Text style={styles.boldText}>{parseTrademarks(cleanKey)}: </Text>
                    {parseTrademarks(pointValue as string)}
                  </>
                ) : (
                  parseTrademarks(pointValue as string)
                )}
              </Text>
            </View>
          );
        })}
        
        {/* Closing statement */}
        {highlightData.closingStatement && (
          <View style={{ marginTop: 8 }}>
            <Text style={{ ...styles.highlightText }}>
              {parseTrademarks(highlightData.closingStatement)}
            </Text>
          </View>
        )}
      </>
    )}
  </View>
);

// Render phase section with items
const renderPhaseSection = (phaseData: PhaseData, key: string | number) => (
  <View key={key} style={{ marginBottom: 10 }} wrap>
    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 5 }}>
      <BrainIcon />
      <Text style={{ ...styles.phaseTitle, marginLeft: 4 }}>{parseTrademarks(phaseData.title)}</Text>
    </View>

    {phaseData.items && (
      <View style={{ marginLeft: 15 }}>
        {phaseData.items.focus && (
          <View style={styles.bulletRow}>
            <Text style={styles.bulletMarker}>•</Text>
            <Text style={styles.bulletPoint}>
              <Text style={{ ...styles.boldText, fontStyle: 'italic' }}>Focus: </Text>
              {parseTrademarks(phaseData.items.focus)}
            </Text>
          </View>
        )}
        {phaseData.items.tools && (
          <View style={styles.bulletRow}>
            <Text style={styles.bulletMarker}>•</Text>
            <Text style={styles.bulletPoint}>
              <Text style={{ ...styles.boldText, fontStyle: 'italic' }}>Tools: </Text>
              {parseTrademarks(phaseData.items.tools)}
            </Text>
          </View>
        )}
        {phaseData.items.goal && (
          <View style={styles.bulletRow}>
            <Text style={styles.bulletMarker}>•</Text>
            <Text style={styles.bulletPoint}>
              <Text style={{ ...styles.boldText, fontStyle: 'italic' }}>Goal: </Text>
              {parseTrademarks(phaseData.items.goal)}
            </Text>
          </View>
        )}
      </View>
    )}
  </View>
);

// Render section with items (bullet points)
const renderSectionWithItems = (sectionData: SectionData, key: string | number) => (
  <View key={key} wrap>
    <Text style={styles.sectionTitle}>{parseTrademarks(sectionData.title)}</Text>
    {sectionData.content && <Text style={styles.normalText}>{parseTrademarks(sectionData.content)}</Text>}
    
    {/* Support for sub-title and reason in Transformation Theme section */}
    {sectionData['sub-title'] && (
      <View style={{ marginTop: 5, marginBottom: 5 }}>
        <Text style={{ ...styles.boldText, marginBottom: 5 }}>{parseTrademarks(sectionData['sub-title'])}</Text>
        {sectionData.reason && <Text style={styles.normalText}>{parseTrademarks(sectionData.reason)}</Text>}
      </View>
    )}

    {sectionData.items && sectionData.items.map((item: string, idx: number) => (
      <View key={`${key}_item_${idx}`} style={styles.bulletRow}>
        <Text style={{ ...styles.bulletMarker, fontWeight: 'bold' }}>•</Text>
        <Text style={styles.bulletPoint}>{parseTrademarks(item)}</Text>
      </View>
    ))}
  </View>
);

// Render milestone table
const renderMilestoneTable = (milestones: MilestoneItem[]) => (
  <View style={{ marginVertical: 15 }} wrap>
    <Text style={styles.sectionTitle}>12-Week Milestone Map</Text>
    <View style={styles.tableHeader}>
      <Text style={styles.tableCellHeader}>Milestone</Text>
      <Text style={styles.tableCellHeader}>Target Week</Text>
      <Text style={styles.tableCellHeader}>Tools & Focus</Text>
    </View>
    {milestones.map((milestone, i) => (
      <View key={i} style={styles.tableRow}>
        <Text style={styles.tableCell}>{parseTrademarks(milestone.milestone)}</Text>
        <Text style={styles.tableCell}>{parseTrademarks(milestone.targetWeek)}</Text>
        <Text style={styles.tableCell}>{parseTrademarks(milestone.toolsAndFocus)}</Text>
      </View>
    ))}
  </View>
);

// Trademark component
const Trademark = () => (
  <Text style={{ 
    fontSize: 8, 
    verticalAlign: 'super', 
    position: 'relative', 
    top: -5,
    fontFamily: 'Times-Roman',
    fontWeight: 'bold'
  }}>TM</Text>
);

// Registered trademark component
const RegisteredTrademark = () => (
  <Text style={{ 
    fontSize: 8, 
    verticalAlign: 'super', 
    position: 'relative', 
    top: -5,
    fontFamily: 'Times-Roman',
    fontWeight: 'bold'
  }}>®</Text>
);

// Custom parse function to handle trademark and registered trademark symbols
const parseTrademarks = (text: string) => {
  if (!text) return null;
  
  // Clean the text first
  const cleaned = cleanText(text);
  
  // Look for trademark symbols
  if (!cleaned.includes('TM') && !cleaned.includes('(R)')) {
    return <Text>{cleaned}</Text>;
  }
  
  // Split the text at trademark/registered symbols
  const parts = cleaned.split(/(TM|\(R\))/g);
  
  return (
    <Text>
      {parts.map((part, index) => {
        if (part === 'TM') {
          return <Trademark key={index} />;
        } else if (part === '(R)') {
          return <RegisteredTrademark key={index} />;
        } else {
          return part;
        }
      })}
    </Text>
  );
};

// Phases Section with page break
const renderPhasesSection = (section: SectionData, firstName: string) => (
  <React.Fragment>
    <PageBreak />
    <View style={{ marginBottom: 10 }} wrap>
      <Text style={styles.sectionTitle}>{parseTrademarks(section.title)}</Text>

      {section.phases && section.phases.map((phase: PhaseData, phaseIndex: number) => (
        <React.Fragment key={`phase_${phaseIndex}`}>
          {renderPhaseSection(phase, `prac_phase_${phaseIndex}`)}
        </React.Fragment>
      ))}
    </View>
    <SectionSeparator />
  </React.Fragment>
);

// Generate client PDF with properly structured data
export const generateClientPDF = async (firstName: string, clientReport: ClientReport, frontendResponses?: { questions: string[], responses: { [key: string]: string } }) => {
  const report = clientReport;

  // Create question data from frontend responses if provided
  let questionSection = report['question-section'];
  
  // Transform question sections to ensure consistent format
  if (questionSection) {
    questionSection = questionSection.map((item, index) => {
      // Handle new format with type and aiInsights
      if (item.type === "question-insight" && Array.isArray(item.aiInsights)) {
        const qKey = `ques${index + 1}`;
        return {
          title: frontendResponses?.questions?.[index] || `Question ${index + 1}`,
          clientResponse: frontendResponses?.responses?.[qKey] || '',
          aiInsights: item.aiInsights
        };
      }
      
      // Handle old format or mixed format
      return {
        title: item.title || frontendResponses?.questions?.[index] || `Question ${index + 1}`,
        clientResponse: item.clientResponse || frontendResponses?.responses?.[`ques${index + 1}`] || '',
        aiInsight: item.aiInsight || '',
        aiInsights: Array.isArray(item.aiInsights) ? item.aiInsights : []
      };
    });
  } 
  // Create from frontend responses if no question section provided
  else if (frontendResponses && frontendResponses.questions && frontendResponses.responses) {
    questionSection = frontendResponses.questions.map((question, index) => {
      const qKey = `ques${index + 1}`;
      return {
        title: question,
        clientResponse: frontendResponses.responses[qKey] || '',
        aiInsight: 'Analysis in progress...'
      };
    });
  }

  // If we still don't have question section data, create default
  if (!questionSection || questionSection.length === 0) {
    console.warn("No question section data available, using placeholder");
    questionSection = [
      {
        title: "Where are you right now in your life, emotionally and mentally?",
        clientResponse: "Response not available",
        aiInsight: "Analysis in progress..."
      },
      {
        title: "What is something you deeply want—but haven't yet achieved?",
        clientResponse: "Response not available",
        aiInsight: "Analysis in progress..."
      },
      {
        title: "What recurring thoughts, fears, or beliefs do you find yourself struggling with?",
        clientResponse: "Response not available",
        aiInsight: "Analysis in progress..."
      },
      {
        title: "When was the last time you felt truly aligned—with yourself, your goals, or your life?",
        clientResponse: "Response not available",
        aiInsight: "Analysis in progress..."
      },
      {
        title: "If you could reprogram one part of your mind—what would it be, and why?",
        clientResponse: "Response not available",
        aiInsight: "Analysis in progress..."
      }
    ];
  }

  const ClientPDF = (
    <Document>
      <Page size="A4" style={styles.page} wrap>
        {/* Fixed banner at the top */}
        <View style={styles.fullWidthBanner} fixed>
          <Image
            src="/banner1.png"
            style={styles.bannerImage}
            cache={false}
          />
        </View>

        {/* Fixed header space to maintain consistent spacing on all pages */}
        <View style={styles.fixedHeader} fixed />

        {/* Content container */}
        <View style={styles.contentContainer}>
          {/* Header Section */}
          <View style={styles.titleContainer}>
            {/* <Text style={styles.reportTitle}>Client Assessment Report for {parseTrademarks(firstName)}</Text> */}
            <Text style={styles.reportTitle}>Neuro Change Method™ Client Assessment Report</Text>
            <Text style={styles.subtitle}>Prepared by DreamScape AI</Text>
            <Text style={styles.openingStatement}>
              {parseTrademarks(firstName)}, what you're about to read isn't just a reflection—it's a revelation. This assessment draws on evidence-based psychological frameworks and cutting-edge insight tools to uncover the hidden architecture of your mindset, motivations, and identity with stunning clarity.
            </Text>
          </View>

          <SectionSeparator />

          {/* Question Sections */}
          {questionSection && questionSection.length > 0 && questionSection.map((question: QuestionData, index: number) => (
            <React.Fragment key={`question_${index}`}>
              {renderQuestionSection(question, `client_question_${index}`)}
              {index < (questionSection?.length ?? 0) - 1 && <SectionSeparator />}
            </React.Fragment>
          ))}

          <SectionSeparator />

          {/* Highlight Section */}
          {report['highlight-section'] && (
            <React.Fragment>
              {renderHighlightSection(report['highlight-section'], 'client_highlight')}
            </React.Fragment>
          )}

          <SectionSeparator />

          {/* Fixed Closing Section */}
          <View style={styles.closingSection}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 5 }} wrap={false}>
              <DiamondIcon />
              <Text style={{ ...styles.sectionTitle, marginLeft: 4, marginBottom: 10 }}>Why Now, Why You, and Why a Neuro Change Practitioner?</Text>
            </View>
            <Text style={{ ...styles.normalText, marginBottom: 10 }}>
              {parseTrademarks(firstName)}, you're standing at a powerful crossroads—between where you've been and the future you're ready to claim. You don't need more inspiration—you need integration. You don't need more information—you need implementation.
              {'\n\n'}And that's where our Accredited Neuro Change Practitioners come in.
            </Text>
            <Text style={{ ...styles.normalText, marginBottom: 10 }}>
              The Neuro Change Method™ is not coaching. It's not motivational speaking. It is a scientifically grounded, evidence-based transformation framework—built on the latest research in neuroscience, cognitive psychology, and behavioral change theory.
            </Text>
            <Text style={{ ...styles.normalText, marginBottom: 10 }}>
              Unlike traditional life coaches, our practitioners undergo rigorous training, accreditation, and ongoing mentorship. Their work is backed by our professional practice guidelines and validated through our Neuro Change Method™ White Paper, ensuring that every tool, every session, and every insight you receive is rooted in measurable, real-world efficacy.
            </Text>
            <Text style={{ ...styles.normalText, marginBottom: 10 }}>
              What makes this different is the precision and personalization. Working with a Neuro Change Practitioner means working with someone who is:
            </Text>
            <View style={{ marginLeft: 15, marginBottom: 10 }}>
              <View style={styles.bulletRow}>
                <Text style={styles.bulletMarker}>•</Text>
                <Text style={styles.bulletPoint}>Highly trained in neuroplasticity, mindset reframing, belief engineering, and subconscious integration.</Text>
              </View>
              <View style={styles.bulletRow}>
                <Text style={styles.bulletMarker}>•</Text>
                <Text style={styles.bulletPoint}>Supported by a powerful AI-enhanced framework that helps uncover the hidden dimensions of your transformation—your unconscious thought patterns, internal conflicts, and suppressed potential.</Text>
              </View>
              <View style={styles.bulletRow}>
                <Text style={styles.bulletMarker}>•</Text>
                <Text style={styles.bulletPoint}>Focused solely on you—your identity, your values, and your outcomes.</Text>
              </View>
            </View>
            <Text style={{ ...styles.normalText, marginBottom: 10 }}>
              This isn't generic advice. It's scientific strategy tailored to your deepest aspirations. And it's delivered with professional care, confidentiality, and compassion.
            </Text>
            <Text style={{ ...styles.normalText, marginBottom: 10 }}>
              Booking a time to speak with one of our accredited practitioners isn't just a step forward—it's a strategic move toward the most aligned, empowered, and unstoppable version of yourself.
            </Text>
            <Text style={{ ...styles.normalText, marginBottom: 10 }}>
              Are you ready to stop waiting for permission—and start building the reality that reflects who you already are?
            </Text>
            <View style={{ flexDirection: 'row', alignItems: 'flex-start', marginTop: 5 }} wrap={false}>
              <CalendarIcon />
              <Text style={{ marginLeft: 4, fontWeight: 'bold', flex: 1 }}>
                Book your complimentary 20 minute discovery session with an Accredited Neuro Change Practitioner today. Your next breakthrough isn't in the future. It's in your decision to act now.
              </Text>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );

  return await pdf(ClientPDF).toBlob();
};

// Generate practitioner PDF with properly structured data
export const generatePractitionerPDF = async (firstName: string, practitionerReport: PractitionerReport) => {
  const report = practitionerReport;

  // Check if there are highlight sections in the report structure
  const hasHighlights = report.sections?.some(section => 
    section.title && section.title.toLowerCase().includes('highlight')
  );

  // Get only the "other sections" (not Client Summary, Phases, or Highlights)
  const otherSections = report.sections?.filter(section => 
    section.title !== 'Client Summary' && 
    section.title !== 'Client Profile Summary' &&
    section.title !== 'Neuro Change Method™: Your 4-Phase Transformation Journey' &&
    !(section.title && section.title.toLowerCase().includes('highlight'))
  ) || [];

  const PractitionerPDF = (
    <Document>
      <Page size="A4" style={styles.page} wrap>
        {/* Fixed banner at the top of every page */}
        <View style={styles.fullWidthBanner} fixed>
          <Image
            src="/banner1.png"
            style={styles.bannerImage}
            cache={false}
          />
        </View>

        {/* Fixed header space to maintain consistent spacing on all pages */}
        <View style={styles.fixedHeader} fixed />

        {/* Content container */}
        <View style={styles.contentContainer}>
          <View style={styles.titleContainer}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 5 }}>
              <CompassIcon />
              <Text style={{ ...styles.reportTitle, marginLeft: 4 }}>Neuro Change Method™ Practitioner Report</Text>
            </View>
          </View>

          {/* Client Summary Section */}
          {report.sections && report.sections.map((section: SectionData, sectionIndex: number) => {
            if (section.title === 'Client Summary' || section.title === 'Client Profile Summary') {
              return (
                <React.Fragment key={`summary_section`}>
                  <View style={{ marginBottom: 10 }} wrap>
                    <Text style={{...styles.sectionTitle, marginTop: 5}}>Client Profile Summary</Text>
                    {section.content && <Text style={styles.normalText}>{parseTrademarks(section.content)}</Text>}

                    {section.primaryObjective && (
                      <View style={{ marginTop: 10 }}>
                        <Text style={styles.subsectionTitle}>Primary Objective:</Text>
                        <Text style={styles.normalText}>{parseTrademarks(section.primaryObjective)}</Text>
                      </View>
                    )}
                  </View>
                  <SectionSeparator />
                </React.Fragment>
              );
            }
            
            // Check if this is a highlight section and use alternating icons
            if (section.title && section.title.toLowerCase().includes('highlight')) {
              const highlightData: HighlightData = {
                title: section.title,
                content: section.content || '',
                points: section.items?.reduce((obj, item, i) => {
                  obj[`Point ${i+1}`] = item;
                  return obj;
                }, {} as Record<string, string>)
              };
              
              return (
                <React.Fragment key={`highlight_section_${sectionIndex}`}>
                  {renderHighlightSection(highlightData, `prac_highlight_${sectionIndex}`)}
                  <SectionSeparator />
                </React.Fragment>
              );
            }
            
            return null;
          })}

          {/* Other Sections */}
          {otherSections.map((section: SectionData, sectionIndex: number) => (
            <React.Fragment key={`section_${section.title}`}>
              {renderSectionWithItems(section, `prac_section_${section.title}`)}
              {sectionIndex < otherSections.length - 1 && <SectionSeparator />}
            </React.Fragment>
          ))}

          {/* Phases Section - with forced page break */}
          {report.sections && report.sections.map((section: SectionData) => {
            if (section.title === 'Neuro Change Method™: Your 4-Phase Transformation Journey') {
              return (
                <React.Fragment key={`phases_section`}>
                  {renderPhasesSection(section, firstName)}
                </React.Fragment>
              );
            }
            return null;
          })}

          {/* Milestones Table */}
          {report.milestones && report.milestones.length > 0 && (
            <React.Fragment>
              {renderMilestoneTable(report.milestones)}
              <SectionSeparator />
            </React.Fragment>
          )}

          {/* Projected Transformation Outcomes */}
          {report.projectedTransformationOutcomes && (
            <React.Fragment>
              <View style={{ marginBottom: 10 }} wrap>
                <Text style={styles.sectionTitle}>Projected Transformation Outcomes</Text>
                <Text style={styles.normalText}>If {parseTrademarks(firstName)} fully embraces this transformation journey, expect:</Text>
                {report.projectedTransformationOutcomes.map((outcome: string, idx: number) => (
                  <View key={`outcome_${idx}`} style={styles.bulletRow}>
                    <Text style={styles.bulletMarker}>•</Text>
                    <Text style={styles.bulletPoint}>{parseTrademarks(outcome)}</Text>
                  </View>
                ))}
              </View>
              {/* <SectionSeparator /> */}
            </React.Fragment>
          )}

          {/* Closing Statement */}
          {report.closingStatement && (
            <React.Fragment>
              <View style={styles.closingSection}>
                <Text>{parseTrademarks(report.closingStatement)}</Text>
              </View>
              <SectionSeparator />
            </React.Fragment>
          )}

          {/* Practitioner Notes Section - Moved after closing statement */}
          {report.practitionerNotes && (
            <React.Fragment>
              <View wrap>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 5 }}>
                  <PencilIcon />
                  <Text style={{ ...styles.sectionTitle, marginLeft: 4 }}>Practitioner Notes</Text>
                </View>
                
                {report.practitionerNotes.temperament && (
                  <View style={{ marginBottom: 10 }}>
                    <Text style={styles.subsectionTitle}>Client Temperament:</Text>
                    <Text style={styles.normalText}>{parseTrademarks(report.practitionerNotes.temperament)}</Text>
                  </View>
                )}
                
                {report.practitionerNotes["best-practices"] && report.practitionerNotes["best-practices"].length > 0 && (
                  <View style={{ marginBottom: 10 }}>
                    <Text style={styles.subsectionTitle}>Best Practices for This Client:</Text>
                    {report.practitionerNotes["best-practices"].map((practice: string, idx: number) => (
                      <View key={`practice_${idx}`} style={styles.bulletRow}>
                        <Text style={styles.bulletMarker}>•</Text>
                        <Text style={styles.bulletPoint}>{parseTrademarks(practice)}</Text>
                      </View>
                    ))}
                  </View>
                )}
              </View>
              {/* No SectionSeparator here since this is the last section */}
            </React.Fragment>
          )}
        </View>
      </Page>
    </Document>
  );

  return await pdf(PractitionerPDF).toBlob();
}; 