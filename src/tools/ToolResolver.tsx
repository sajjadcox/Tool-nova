import React from 'react';
import { ToolDefinition } from '../types';

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
import { PdfCompressor } from './pdf/PdfCompressor';
import { ImageToPdf } from './pdf/ImageToPdf';
import { PdfMerger } from './pdf/PdfMerger';
import { PdfSplitter } from './pdf/PdfSplitter';
import { PdfPageCounter } from './pdf/PdfPageCounter';
import { PdfMetadataViewer } from './pdf/PdfMetadataViewer';
import { PdfWatermark } from './pdf/PdfWatermark';
import { PdfPageRotator } from './pdf/PdfPageRotator';
import { PdfToImages } from './pdf/PdfToImages';
import { PdfPageExtractor } from './pdf/PdfPageExtractor';
import { PdfPageNumbering } from './pdf/PdfPageNumbering';
import { PdfTextExtractor } from './pdf/PdfTextExtractor';
import { PdfToGrayscale } from './pdf/PdfToGrayscale';
import { PdfPasswordUtility } from './pdf/PdfPasswordUtility';
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
import { TextSummarizer } from './text/TextSummarizer';

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
import { JavascriptFormatter } from './developer/JavascriptFormatter';
import { JavascriptMinifier } from './developer/JavascriptMinifier';

// Calculators & Date/Time
import { PercentageCalculator } from './calculators/PercentageCalculator';
import { BasicCalculator } from './calculators/BasicCalculator';
import { UnitConverter } from './calculators/UnitConverter';
import { DiscountCalculator } from './calculators/DiscountCalculator';
import { ProfitLossCalculator } from './calculators/ProfitLossCalculator';
import { AgeCalculator } from './calculators/AgeCalculator';
import { DateDifferenceCalculator } from './calculators/DateDifferenceCalculator';
import { BmiCalculator } from './calculators/BmiCalculator';
import { LoanEmiCalculator } from './calculators/LoanEmiCalculator';
import { TimeZoneConverter } from './calculators/TimeZoneConverter';
import { CountdownCalculator } from './calculators/CountdownCalculator';
import { WorkingDaysCalculator } from './calculators/WorkingDaysCalculator';
import { DateFormatConverter } from './calculators/DateFormatConverter';

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
import { TotpCodeGenerator } from './security/TotpCodeGenerator';
import { UrlSafetyChecker } from './security/UrlSafetyChecker';
import { SecurityHeaderChecker } from './security/SecurityHeaderChecker';

// Social
import { YouTubeThumbnailTool } from './social/YouTubeThumbnailTool';
import { HashtagGenerator } from './social/HashtagGenerator';
import { CharacterLimitChecker } from './social/CharacterLimitChecker';
import { YouTubeDescriptionFormatter } from './social/YouTubeDescriptionFormatter';
import { OpenGraphImagePreview } from './social/OpenGraphImagePreview';
import { FacebookPostPreview } from './social/FacebookPostPreview';
import { SocialCaptionFormatter } from './social/SocialCaptionFormatter';
import { InstagramBioFormatter } from './social/InstagramBioFormatter';

// File Tools
import { CsvToJson } from './file/CsvToJson';
import { JsonToCsv } from './file/JsonToCsv';
import { CsvViewer } from './file/CsvViewer';
import { FileSizeConverter } from './file/FileSizeConverter';
import { MimeTypeInspector } from './file/MimeTypeInspector';
import { XmlFormatter } from './file/XmlFormatter';

// Writing & Language
import { MarkdownPreviewer } from './writing/MarkdownPreviewer';
import { GrammarChecker } from './writing/GrammarChecker';
import { SpellChecker } from './writing/SpellChecker';
import { SentenceRewriter } from './writing/SentenceRewriter';
import { TextTranslator } from './writing/TextTranslator';

// Video & Audio
import { VideoThumbnailExtractor } from './video/VideoThumbnailExtractor';
import { VideoMetadataViewer } from './video/VideoMetadataViewer';
import { ScreenRecorderTool } from './video/ScreenRecorderTool';
import { VideoToGif } from './video/VideoToGif';
import { AudioWaveformViewer } from './audio/AudioWaveformViewer';
import { AudioTrimmer } from './audio/AudioTrimmer';
import { AudioVolumeBooster } from './audio/AudioVolumeBooster';
import { ToneGenerator } from './audio/ToneGenerator';
import { AudioSpeedChanger } from './audio/AudioSpeedChanger';
import { AudioMetadataViewer } from './audio/AudioMetadataViewer';

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
import { MetaTagAnalyzer } from './seo/MetaTagAnalyzer';
import { HreflangTagGenerator } from './seo/HreflangTagGenerator';
import { RedirectRuleGenerator } from './seo/RedirectRuleGenerator';
import { HttpHeaderAnalyzer } from './seo/HttpHeaderAnalyzer';

interface ToolResolverProps {
  tool: ToolDefinition;
}

export const ToolResolver: React.FC<ToolResolverProps> = ({ tool }) => {
  // Direct check by componentKey or slug
  const key = tool.componentKey || tool.slug;

  switch (key) {
    // PDF Tools
    case 'PdfCompressor':
    case 'pdf-compressor':
      return <PdfCompressor />;
    case 'ImageToPdf':
    case 'image-to-pdf':
      return <ImageToPdf />;
    case 'PdfMerger':
    case 'pdf-merger':
      return <PdfMerger />;
    case 'PdfSplitter':
    case 'pdf-splitter':
      return <PdfSplitter />;
    case 'PdfPageCounter':
    case 'pdf-page-counter':
      return <PdfPageCounter />;
    case 'PdfMetadataViewer':
    case 'pdf-metadata-viewer':
      return <PdfMetadataViewer />;
    case 'PdfWatermark':
    case 'pdf-watermark-tool':
      return <PdfWatermark />;
    case 'PdfPageRotator':
    case 'pdf-page-rotator':
      return <PdfPageRotator />;
    case 'PdfToImages':
    case 'pdf-to-images':
      return <PdfToImages />;
    case 'PdfPageExtractor':
    case 'pdf-page-extractor':
      return <PdfPageExtractor />;
    case 'PdfPageNumbering':
    case 'pdf-page-numbering':
      return <PdfPageNumbering />;
    case 'PdfTextExtractor':
    case 'pdf-text-extractor':
      return <PdfTextExtractor />;
    case 'PdfToGrayscale':
    case 'pdf-to-grayscale':
      return <PdfToGrayscale />;
    case 'PdfPasswordUtility':
    case 'pdf-password-utility':
      return <PdfPasswordUtility />;
    case 'TextToPdf':
    case 'text-to-pdf':
      return <TextToPdf />;

    // Image Tools
    case 'ImageCompressor':
    case 'image-compressor':
      return <ImageCompressor />;
    case 'ImageResizer':
    case 'image-resizer':
      return <ImageResizer />;
    case 'ImageCropper':
    case 'image-cropper':
      return <ImageCropper />;
    case 'ImageFormatConverter':
    case 'image-to-png':
    case 'image-to-jpg':
    case 'image-to-webp':
      return <ImageFormatConverter />;
    case 'ImageRotator':
    case 'image-rotator':
      return <ImageRotator />;
    case 'ImageGrayscale':
    case 'image-grayscale':
      return <ImageGrayscale />;
    case 'ImageEditor':
    case 'image-editor':
      return <ImageEditor />;
    case 'Base64ToImage':
    case 'base64-to-image':
      return <Base64ToImage />;
    case 'ImageMetadataViewer':
    case 'image-metadata-viewer':
      return <ImageMetadataViewer />;
    case 'SocialMediaImageResizer':
    case 'social-media-image-resizer':
      return <ImageResizer />;

    // Text Tools
    case 'WordCounter':
    case 'word-counter':
      return <WordCounter />;
    case 'CaseConverter':
    case 'case-converter':
      return <CaseConverter />;
    case 'RemoveExtraSpaces':
    case 'remove-extra-spaces':
      return <RemoveExtraSpaces />;
    case 'RemoveDuplicateLines':
    case 'remove-duplicate-lines':
      return <RemoveDuplicateLines />;
    case 'TextDiffChecker':
    case 'text-diff-checker':
      return <TextDiffChecker />;
    case 'FindAndReplace':
    case 'find-and-replace':
      return <FindAndReplace />;
    case 'TextSorter':
    case 'text-sorter':
      return <TextSorter />;
    case 'LoremIpsumGenerator':
    case 'lorem-ipsum-generator':
      return <LoremIpsumGenerator />;
    case 'TextReverser':
    case 'text-reverser':
      return <TextReverser />;
    case 'TextSummarizer':
    case 'text-summarizer':
      return <TextSummarizer />;

    // Developer Tools
    case 'JsonFormatter':
    case 'json-formatter':
      return <JsonFormatter />;
    case 'Base64Tool':
    case 'base64-encoder-decoder':
      return <Base64Tool />;
    case 'UrlEncoderDecoder':
    case 'url-encoder-decoder':
      return <UrlEncoderDecoder />;
    case 'UuidGenerator':
    case 'uuid-generator':
      return <UuidGenerator />;
    case 'UnixTimestampConverter':
    case 'unix-timestamp-converter':
      return <UnixTimestampConverter />;
    case 'RegexTester':
    case 'regex-tester':
      return <RegexTester />;
    case 'SqlFormatter':
    case 'sql-formatter':
      return <SqlFormatter />;
    case 'HtmlFormatter':
    case 'html-formatter':
      return <HtmlFormatter />;
    case 'CssFormatter':
    case 'css-formatter':
      return <CssFormatter />;
    case 'JavascriptFormatter':
    case 'javascript-formatter':
      return <JavascriptFormatter />;
    case 'JavascriptMinifier':
    case 'javascript-minifier':
      return <JavascriptMinifier />;

    // Calculators & Date/Time
    case 'PercentageCalculator':
    case 'percentage-calculator':
      return <PercentageCalculator />;
    case 'BasicCalculator':
    case 'basic-calculator':
      return <BasicCalculator />;
    case 'UnitConverter':
    case 'unit-converter':
    case 'currency-converter':
    case 'CurrencyConverter':
      return <UnitConverter />;
    case 'DiscountCalculator':
    case 'discount-calculator':
    case 'gst-vat-calculator':
    case 'GstVatCalculator':
      return <DiscountCalculator />;
    case 'ProfitLossCalculator':
    case 'profit-loss-calculator':
      return <ProfitLossCalculator />;
    case 'AgeCalculator':
    case 'age-calculator':
      return <AgeCalculator />;
    case 'DateDifferenceCalculator':
    case 'date-difference-calculator':
      return <DateDifferenceCalculator />;
    case 'BmiCalculator':
    case 'bmi-calculator':
      return <BmiCalculator />;
    case 'LoanEmiCalculator':
    case 'loan-emi-calculator':
      return <LoanEmiCalculator />;
    case 'TimeZoneConverter':
    case 'time-zone-converter':
      return <TimeZoneConverter />;
    case 'CountdownCalculator':
    case 'countdown-calculator':
      return <CountdownCalculator />;
    case 'WorkingDaysCalculator':
    case 'working-days-calculator':
      return <WorkingDaysCalculator />;
    case 'DateFormatConverter':
    case 'date-format-converter':
      return <DateFormatConverter />;
    case 'ScientificCalculator':
    case 'scientific-calculator':
      return <BasicCalculator />;

    // Color & Design
    case 'ColorPickerTool':
    case 'color-picker':
    case 'color-palette-generator':
    case 'ColorPaletteGenerator':
      return <ColorPickerTool />;
    case 'ContrastChecker':
    case 'contrast-checker':
      return <ContrastChecker />;
    case 'GradientGenerator':
    case 'gradient-generator':
      return <GradientGenerator />;
    case 'CssBoxShadowGenerator':
    case 'box-shadow-generator':
    case 'css-box-shadow-generator':
    case 'CssBorderRadiusGenerator':
    case 'css-border-radius-generator':
    case 'CssButtonGenerator':
    case 'css-button-generator':
    case 'CssGlassmorphismGenerator':
    case 'css-glassmorphism-generator':
      return <CssBoxShadowGenerator />;

    // Security & Privacy
    case 'PasswordGenerator':
    case 'password-generator':
      return <PasswordGenerator />;
    case 'PasswordStrengthChecker':
    case 'password-strength-checker':
      return <PasswordStrengthChecker />;
    case 'HashGenerator':
    case 'hash-generator':
      return <HashGenerator />;
    case 'HashVerifier':
    case 'hash-verifier':
      return <HashVerifier />;
    case 'RandomTokenGenerator':
    case 'random-token-generator':
      return <RandomTokenGenerator />;
    case 'JwtDecoder':
    case 'jwt-decoder':
      return <JwtDecoder />;
    case 'FileChecksumCalculator':
    case 'file-checksum-calculator':
      return <FileChecksumCalculator />;
    case 'TotpCodeGenerator':
    case 'totp-code-generator':
      return <TotpCodeGenerator />;
    case 'UrlSafetyChecker':
    case 'url-safety-checker':
      return <UrlSafetyChecker />;
    case 'SecurityHeaderChecker':
    case 'security-header-checker':
    case 'security-headers-checker':
      return <SecurityHeaderChecker />;

    // Social Media
    case 'YouTubeThumbnailTool':
    case 'youtube-thumbnail-downloader':
      return <YouTubeThumbnailTool />;
    case 'HashtagGenerator':
    case 'hashtag-generator':
      return <HashtagGenerator />;
    case 'CharacterLimitChecker':
    case 'character-limit-checker':
      return <CharacterLimitChecker />;
    case 'YouTubeDescriptionFormatter':
    case 'youtube-description-formatter':
      return <YouTubeDescriptionFormatter />;
    case 'OpenGraphImagePreview':
    case 'open-graph-image-preview':
      return <OpenGraphImagePreview />;
    case 'FacebookPostPreview':
    case 'facebook-post-preview':
      return <FacebookPostPreview />;
    case 'SocialCaptionFormatter':
    case 'social-caption-formatter':
      return <SocialCaptionFormatter />;
    case 'InstagramBioFormatter':
    case 'instagram-bio-formatter':
      return <InstagramBioFormatter />;

    // File Tools
    case 'CsvToJson':
    case 'csv-to-json':
      return <CsvToJson />;
    case 'JsonToCsv':
    case 'json-to-csv':
      return <JsonToCsv />;
    case 'CsvViewer':
    case 'csv-viewer':
      return <CsvViewer />;
    case 'FileSizeConverter':
    case 'file-size-converter':
      return <FileSizeConverter />;
    case 'MimeTypeInspector':
    case 'mime-type-inspector':
      return <MimeTypeInspector />;
    case 'FileMetadataViewer':
    case 'file-metadata-viewer':
      return <FileChecksumCalculator />;
    case 'XmlFormatter':
    case 'xml-formatter':
      return <XmlFormatter />;
    case 'XmlToJson':
    case 'xml-to-json':
      return <CsvToJson />;

    // Writing & Language
    case 'MarkdownPreviewer':
    case 'markdown-previewer':
      return <MarkdownPreviewer />;
    case 'GrammarChecker':
    case 'grammar-checker':
      return <GrammarChecker />;
    case 'SpellChecker':
    case 'spell-checker':
      return <SpellChecker />;
    case 'SentenceRewriter':
    case 'sentence-rewriter':
      return <SentenceRewriter />;
    case 'TextTranslator':
    case 'text-translator':
      return <TextTranslator />;

    // Video & Audio
    case 'VideoThumbnailExtractor':
    case 'video-thumbnail-extractor':
      return <VideoThumbnailExtractor />;
    case 'VideoMetadataViewer':
    case 'video-metadata-viewer':
      return <VideoMetadataViewer />;
    case 'ScreenRecorder':
    case 'screen-recorder':
      return <ScreenRecorderTool />;
    case 'VideoToGif':
    case 'video-to-gif':
      return <VideoToGif />;
    case 'AudioWaveformViewer':
    case 'audio-waveform-viewer':
      return <AudioWaveformViewer />;
    case 'AudioTrimmer':
    case 'audio-trimmer':
      return <AudioTrimmer />;
    case 'AudioVolumeBooster':
    case 'audio-volume-booster':
    case 'audio-volume-changer':
    case 'AudioVolumeChanger':
      return <AudioVolumeBooster />;
    case 'ToneGenerator':
    case 'tone-generator':
      return <ToneGenerator />;
    case 'AudioSpeedChanger':
    case 'audio-speed-changer':
      return <AudioSpeedChanger />;
    case 'AudioMetadataViewer':
    case 'audio-metadata-viewer':
      return <AudioMetadataViewer />;

    // Productivity
    case 'QrCodeGenerator':
    case 'qr-code-generator':
      return <QrCodeGenerator />;
    case 'QrCodeReader':
    case 'qr-code-reader':
      return <QrCodeReader />;
    case 'StopwatchTool':
    case 'stopwatch':
      return <StopwatchTool />;
    case 'CountdownTimerTool':
    case 'countdown-timer':
      return <CountdownTimerTool />;
    case 'NotesPadTool':
    case 'notes-scratchpad':
      return <NotesPadTool />;
    case 'ChecklistMakerTool':
    case 'checklist-maker':
      return <ChecklistMakerTool />;
    case 'BarcodeGenerator':
    case 'barcode-generator':
      return <BarcodeGenerator />;
    case 'PasswordProtectedText':
    case 'password-protected-text':
      return <PasswordProtectedText />;

    // SEO
    case 'MetaTagGenerator':
    case 'meta-tag-generator':
      return <MetaTagGenerator />;
    case 'SchemaMarkupGenerator':
    case 'schema-markup-generator':
      return <MetaTagGenerator />;
    case 'SerpSnippetPreview':
    case 'serp-snippet-preview':
      return <SerpSnippetPreview />;
    case 'RobotsTxtGenerator':
    case 'robots-txt-generator':
      return <RobotsTxtGenerator />;
    case 'SlugGenerator':
    case 'slug-generator':
      return <SlugGenerator />;
    case 'UtmBuilder':
    case 'utm-builder':
      return <UtmBuilder />;
    case 'SitemapXmlGenerator':
    case 'sitemap-xml-generator':
      return <SitemapXmlGenerator />;
    case 'MetaTagAnalyzer':
    case 'meta-tag-analyzer':
      return <MetaTagAnalyzer />;
    case 'HreflangTagGenerator':
    case 'hreflang-tag-generator':
      return <HreflangTagGenerator />;
    case 'RedirectRuleGenerator':
    case 'redirect-rule-generator':
      return <RedirectRuleGenerator />;
    case 'HttpHeaderAnalyzer':
    case 'http-header-analyzer':
      return <HttpHeaderAnalyzer />;

    default:
      // Category-aware fallback so we NEVER show WordCounter for PDF or other categories!
      if (tool.categorySlug === 'pdf-tools' || tool.category === 'PDF Tools') {
        return <PdfCompressor />;
      }
      if (tool.categorySlug === 'image-tools' || tool.category === 'Image Tools') {
        return <ImageCompressor />;
      }
      if (tool.categorySlug === 'developer-tools' || tool.category === 'Developer Tools') {
        return <JsonFormatter />;
      }
      if (tool.categorySlug === 'calculators' || tool.category === 'Calculators') {
        return <BasicCalculator />;
      }
      if (tool.categorySlug === 'date-time-tools' || tool.category === 'Date & Time Tools') {
        return <CountdownCalculator />;
      }
      if (tool.categorySlug === 'security-privacy' || tool.category === 'Security & Privacy') {
        return <PasswordGenerator />;
      }
      if (tool.categorySlug === 'social-media-tools' || tool.category === 'Social Media Tools') {
        return <YouTubeDescriptionFormatter />;
      }
      if (tool.categorySlug === 'audio-tools' || tool.category === 'Audio Tools') {
        return <AudioTrimmer />;
      }
      if (tool.categorySlug === 'video-tools' || tool.category === 'Video Tools') {
        return <VideoThumbnailExtractor />;
      }
      if (tool.categorySlug === 'seo-tools' || tool.category === 'SEO Tools') {
        return <MetaTagAnalyzer />;
      }
      return <CaseConverter />;
  }
};
