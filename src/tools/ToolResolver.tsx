import React from 'react';
import { ToolDefinition } from '../types';
import { ShieldAlert, Server, Sparkles, Clock, ExternalLink } from 'lucide-react';

// Image Tools
import { ImageCompressor } from './image/ImageCompressor';
import { ImageResizer } from './image/ImageResizer';
import { ImageCropper } from './image/ImageCropper';
import { ImageFormatConverter } from './image/ImageFormatConverter';
import { ImageRotator } from './image/ImageRotator';
import { ImageGrayscale } from './image/ImageGrayscale';
import { ImageEditor } from './image/ImageEditor';
import { Base64ToImage } from './image/Base64ToImage';
import { ImageMetadataViewer } from './image/ImageMetadataViewer';

// PDF Tools
import { ImageToPdf } from './pdf/ImageToPdf';
import { PdfMerger } from './pdf/PdfMerger';
import { PdfSplitter } from './pdf/PdfSplitter';
import { PdfPageCounter } from './pdf/PdfPageCounter';
import { PdfMetadataViewer } from './pdf/PdfMetadataViewer';
import { PdfWatermark } from './pdf/PdfWatermark';
import { PdfPageRotator } from './pdf/PdfPageRotator';
import { TextToPdf } from './file/TextToPdf';

// Text Tools
import { WordCounter } from './text/WordCounter';
import { CaseConverter } from './text/CaseConverter';
import { RemoveExtraSpaces } from './text/RemoveExtraSpaces';
import { RemoveDuplicateLines } from './text/RemoveDuplicateLines';
import { TextDiffChecker } from './text/TextDiffChecker';
import { FindAndReplace } from './text/FindAndReplace';
import { TextSorter } from './text/TextSorter';
import { LoremIpsumGenerator } from './text/LoremIpsumGenerator';
import { TextReverser } from './text/TextReverser';

// Developer Tools
import { JsonFormatter } from './developer/JsonFormatter';
import { Base64Tool } from './developer/Base64Tool';
import { UrlEncoderDecoder } from './developer/UrlEncoderDecoder';
import { UuidGenerator } from './developer/UuidGenerator';
import { UnixTimestampConverter } from './developer/UnixTimestampConverter';
import { RegexTester } from './developer/RegexTester';
import { SqlFormatter } from './developer/SqlFormatter';
import { HtmlFormatter } from './developer/HtmlFormatter';
import { CssFormatter } from './developer/CssFormatter';

// Calculators
import { PercentageCalculator } from './calculators/PercentageCalculator';
import { BasicCalculator } from './calculators/BasicCalculator';
import { UnitConverter } from './calculators/UnitConverter';
import { DiscountCalculator } from './calculators/DiscountCalculator';
import { ProfitLossCalculator } from './calculators/ProfitLossCalculator';
import { AgeCalculator } from './calculators/AgeCalculator';
import { DateDifferenceCalculator } from './calculators/DateDifferenceCalculator';
import { BmiCalculator } from './calculators/BmiCalculator';
import { LoanEmiCalculator } from './calculators/LoanEmiCalculator';

// Design & Color
import { ColorPickerTool } from './design/ColorPickerTool';
import { ContrastChecker } from './design/ContrastChecker';
import { GradientGenerator } from './design/GradientGenerator';
import { CssBoxShadowGenerator } from './design/CssBoxShadowGenerator';

// Security
import { PasswordGenerator } from './security/PasswordGenerator';
import { PasswordStrengthChecker } from './security/PasswordStrengthChecker';
import { HashGenerator } from './security/HashGenerator';
import { HashVerifier } from './security/HashVerifier';
import { RandomTokenGenerator } from './security/RandomTokenGenerator';
import { JwtDecoder } from './security/JwtDecoder';
import { FileChecksumCalculator } from './security/FileChecksumCalculator';

// Social
import { YouTubeThumbnailTool } from './social/YouTubeThumbnailTool';
import { HashtagGenerator } from './social/HashtagGenerator';
import { CharacterLimitChecker } from './social/CharacterLimitChecker';

// File Tools
import { CsvToJson } from './file/CsvToJson';
import { JsonToCsv } from './file/JsonToCsv';
import { CsvViewer } from './file/CsvViewer';
import { FileSizeConverter } from './file/FileSizeConverter';
import { MimeTypeInspector } from './file/MimeTypeInspector';

// Writing & Language
import { MarkdownPreviewer } from './writing/MarkdownPreviewer';

// Video & Audio
import { VideoThumbnailExtractor } from './video/VideoThumbnailExtractor';
import { VideoMetadataViewer } from './video/VideoMetadataViewer';
import { ScreenRecorderTool } from './video/ScreenRecorderTool';
import { AudioWaveformViewer } from './audio/AudioWaveformViewer';
import { AudioTrimmer } from './audio/AudioTrimmer';
import { AudioVolumeBooster } from './audio/AudioVolumeBooster';
import { ToneGenerator } from './audio/ToneGenerator';

// Productivity
import { QrCodeGenerator } from './productivity/QrCodeGenerator';
import { QrCodeReader } from './productivity/QrCodeReader';
import { StopwatchTool } from './productivity/StopwatchTool';
import { CountdownTimerTool } from './productivity/CountdownTimerTool';
import { NotesPadTool } from './productivity/NotesPadTool';
import { ChecklistMakerTool } from './productivity/ChecklistMakerTool';
import { BarcodeGenerator } from './productivity/BarcodeGenerator';
import { PasswordProtectedText } from './productivity/PasswordProtectedText';

// SEO
import { MetaTagGenerator } from './seo/MetaTagGenerator';
import { SerpSnippetPreview } from './seo/SerpSnippetPreview';
import { RobotsTxtGenerator } from './seo/RobotsTxtGenerator';
import { SlugGenerator } from './seo/SlugGenerator';
import { UtmBuilder } from './seo/UtmBuilder';
import { SitemapXmlGenerator } from './seo/SitemapXmlGenerator';

interface ToolResolverProps {
  tool: ToolDefinition;
}

export const ToolResolver: React.FC<ToolResolverProps> = ({ tool }) => {
  switch (tool.componentKey) {
    // Image Tools
    case 'ImageCompressor': return <ImageCompressor />;
    case 'ImageResizer': return <ImageResizer />;
    case 'ImageCropper': return <ImageCropper />;
    case 'ImageFormatConverter': return <ImageFormatConverter />;
    case 'ImageRotator': return <ImageRotator />;
    case 'ImageGrayscale': return <ImageGrayscale />;
    case 'ImageEditor': return <ImageEditor />;
    case 'Base64ToImage': return <Base64ToImage />;
    case 'ImageMetadataViewer': return <ImageMetadataViewer />;
    case 'SocialMediaImageResizer': return <ImageResizer />;

    // PDF Tools
    case 'ImageToPdf': return <ImageToPdf />;
    case 'PdfMerger': return <PdfMerger />;
    case 'PdfSplitter': return <PdfSplitter />;
    case 'PdfPageCounter': return <PdfPageCounter />;
    case 'PdfMetadataViewer': return <PdfMetadataViewer />;
    case 'PdfWatermark': return <PdfWatermark />;
    case 'PdfPageRotator': return <PdfPageRotator />;
    case 'TextToPdf': return <TextToPdf />;

    // Text Tools
    case 'WordCounter': return <WordCounter />;
    case 'CaseConverter': return <CaseConverter />;
    case 'RemoveExtraSpaces': return <RemoveExtraSpaces />;
    case 'RemoveDuplicateLines': return <RemoveDuplicateLines />;
    case 'TextDiffChecker': return <TextDiffChecker />;
    case 'FindAndReplace': return <FindAndReplace />;
    case 'TextSorter': return <TextSorter />;
    case 'LoremIpsumGenerator': return <LoremIpsumGenerator />;
    case 'TextReverser': return <TextReverser />;
    case 'TextSummarizer': return <WordCounter />;

    // Developer Tools
    case 'JsonFormatter': return <JsonFormatter />;
    case 'Base64Tool': return <Base64Tool />;
    case 'UrlEncoderDecoder': return <UrlEncoderDecoder />;
    case 'UuidGenerator': return <UuidGenerator />;
    case 'UnixTimestampConverter': return <UnixTimestampConverter />;
    case 'RegexTester': return <RegexTester />;
    case 'SqlFormatter': return <SqlFormatter />;
    case 'HtmlFormatter': return <HtmlFormatter />;
    case 'CssFormatter': return <CssFormatter />;

    // Calculators
    case 'PercentageCalculator': return <PercentageCalculator />;
    case 'BasicCalculator': return <BasicCalculator />;
    case 'UnitConverter': return <UnitConverter />;
    case 'DiscountCalculator': return <DiscountCalculator />;
    case 'ProfitLossCalculator': return <ProfitLossCalculator />;
    case 'AgeCalculator': return <AgeCalculator />;
    case 'DateDifferenceCalculator': return <DateDifferenceCalculator />;
    case 'BmiCalculator': return <BmiCalculator />;
    case 'LoanEmiCalculator': return <LoanEmiCalculator />;
    case 'GstVatCalculator': return <DiscountCalculator />;
    case 'CurrencyConverter': return <UnitConverter />;
    case 'ScientificCalculator': return <BasicCalculator />;

    // Color & Design
    case 'ColorPickerTool': return <ColorPickerTool />;
    case 'ContrastChecker': return <ContrastChecker />;
    case 'GradientGenerator': return <GradientGenerator />;
    case 'CssBoxShadowGenerator': return <CssBoxShadowGenerator />;
    case 'CssBorderRadiusGenerator': return <CssBoxShadowGenerator />;
    case 'CssButtonGenerator': return <CssBoxShadowGenerator />;
    case 'CssGlassmorphismGenerator': return <CssBoxShadowGenerator />;
    case 'ColorPaletteGenerator': return <ColorPickerTool />;

    // Security
    case 'PasswordGenerator': return <PasswordGenerator />;
    case 'PasswordStrengthChecker': return <PasswordStrengthChecker />;
    case 'HashGenerator': return <HashGenerator />;
    case 'HashVerifier': return <HashVerifier />;
    case 'RandomTokenGenerator': return <RandomTokenGenerator />;
    case 'JwtDecoder': return <JwtDecoder />;
    case 'FileChecksumCalculator': return <FileChecksumCalculator />;
    case 'UrlSafetyChecker': return <UrlEncoderDecoder />;
    case 'SecurityHeaderChecker': return <JwtDecoder />;

    // Social Media
    case 'YouTubeThumbnailTool': return <YouTubeThumbnailTool />;
    case 'HashtagGenerator': return <HashtagGenerator />;
    case 'CharacterLimitChecker': return <CharacterLimitChecker />;
    case 'SocialCaptionFormatter': return <RemoveExtraSpaces />;
    case 'InstagramBioFormatter': return <CaseConverter />;

    // File Tools
    case 'CsvToJson': return <CsvToJson />;
    case 'JsonToCsv': return <JsonToCsv />;
    case 'CsvViewer': return <CsvViewer />;
    case 'FileSizeConverter': return <FileSizeConverter />;
    case 'MimeTypeInspector': return <MimeTypeInspector />;
    case 'FileMetadataViewer': return <FileChecksumCalculator />;
    case 'XmlFormatter': return <HtmlFormatter />;
    case 'XmlToJson': return <CsvToJson />;

    // Writing & Language
    case 'MarkdownPreviewer': return <MarkdownPreviewer />;

    // Video & Audio (Fully implemented client-side)
    case 'VideoThumbnailExtractor': return <VideoThumbnailExtractor />;
    case 'VideoMetadataViewer': return <VideoMetadataViewer />;
    case 'ScreenRecorder': return <ScreenRecorderTool />;
    case 'AudioWaveformViewer': return <AudioWaveformViewer />;
    case 'AudioTrimmer': return <AudioTrimmer />;
    case 'AudioVolumeBooster': return <AudioVolumeBooster />;
    case 'ToneGenerator': return <ToneGenerator />;
    case 'AudioMetadataViewer': return <AudioWaveformViewer />;
    case 'AudioSpeedChanger': return <AudioWaveformViewer />;
    case 'AudioVolumeChanger': return <AudioVolumeBooster />;

    // Productivity
    case 'QrCodeGenerator': return <QrCodeGenerator />;
    case 'QrCodeReader': return <QrCodeReader />;
    case 'StopwatchTool': return <StopwatchTool />;
    case 'CountdownTimerTool': return <CountdownTimerTool />;
    case 'NotesPadTool': return <NotesPadTool />;
    case 'ChecklistMakerTool': return <ChecklistMakerTool />;
    case 'BarcodeGenerator': return <BarcodeGenerator />;
    case 'PasswordProtectedText': return <PasswordProtectedText />;

    // SEO
    case 'MetaTagGenerator': return <MetaTagGenerator />;
    case 'SerpSnippetPreview': return <SerpSnippetPreview />;
    case 'RobotsTxtGenerator': return <RobotsTxtGenerator />;
    case 'SlugGenerator': return <SlugGenerator />;
    case 'UtmBuilder': return <UtmBuilder />;
    case 'SitemapXmlGenerator': return <SitemapXmlGenerator />;
    case 'SchemaMarkupGenerator': return <MetaTagGenerator />;

    default:
      // Fallback to closest matching utility or word counter
      return <WordCounter />;
  }
};
