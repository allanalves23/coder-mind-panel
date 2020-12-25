import {
  styled,
  TextField,
  Divider,
  Icon,
  Box,
  Paper,
  AccordionSummary,
} from '@material-ui/core';

import { devices, sizes } from '@/config/devices';

import { Link } from 'react-router-dom';

export const ArticleTitleTextField = styled(TextField)({
  '& input': {
    fontSize: (props) => (props.fontSize ? `${props.fontSize}rem` : '1.15rem'),
    padding: '10px',
  },
  '& .MuiInput-underline': {
    borderRadius: '5px',
    '&:hover': {
      border: '0.5px solid #ccc',
    },
    '&:after': {
      borderBottom: '0px',
    },
    '&:before': {
      borderBottom: '0px',
      content: 'none',
    },
  },
});

export const ArticleDescriptionTextField = styled(TextField)({
  width: sizes.tablet,
  [devices.laptop]: {
    width: sizes.mobileLarge,
  },
  [devices.mobileExtraLarge]: {
    width: sizes.mobileMedium,
  },
  [devices.mobileLarge]: {
    width: sizes.mobileSmall,
  },
  [devices.mobileMedium]: {
    width: 'auto',
  },
  '& input': {
    fontSize: (props) => (props.fontSize ? `${props.fontSize}rem` : '1.15rem'),
    padding: '10px',
  },
  '& .MuiInput-underline': {
    borderRadius: '5px',
    '&:hover': {
      border: '0.5px solid #ccc',
    },
    '&:after': {
      borderBottom: '0px',
    },
    '&:before': {
      borderBottom: '0px',
      content: 'none',
    },
  },
});

export const CustomLink = styled(Link)({
  color: (props) => (props.theme === 'dark' ? '#fff' : null),
});

export const CustomDivider = styled(Divider)({
  marginTop: '5px',
  marginBottom: '10px',
});

export const ArticleLogo = styled(Box)({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  margin: '0 10px',
  '& img': {
    cursor: 'pointer',
    width: '64px',
    borderRadius: '40px',
    objectFit: 'cover',
  },
  [devices.mobileExtraLarge]: {
    display: 'none',
  },
});

export const ArticleIcon = styled(Icon)({
  fontSize: '3rem',
  cursor: 'pointer',
});

export const ArticleContent = styled(TextField)({
  '& textarea': {
    padding: '10px',
  },
  '& .MuiInput-underline': {
    '&:after': {
      borderBottom: '0px',
    },
    '&:before': {
      borderBottom: '0px',
      content: 'none',
    },
  },
});

export const CustomPaper = styled(Paper)({
  display: 'flex',
  alignItems: 'flex-start',
  height: '100%',
});

const markdownPreview = {
  '& .cm-preview': {
    width: '95%',
    padding: '10px',
    overflow: 'hidden',
    '& p, h1, h2, h3, h4, h5, h6, span, strong, code, blockquote, div, section': {
      wordWrap: 'break-word',
    },
  },
};

export const ArticleEditArea = styled(Box)({
  width: (props) => (props.sizewidth === 'withoutPreview' ? '100%' : '50%'),
  height: '100%',
  margin: 8,
  ...markdownPreview,
  [devices.mobileExtraLarge]: {
    '& .cm-preview': {
      display: 'none',
    },
  },
});

export const HudButtons = styled(Box)({
  display: 'flex',
  flexDirection: (props) => (props.smalldevices === 'true' ? 'column' : 'row'),
  [devices.mobileExtraLarge]: {
    alignItems: 'center',
  },
});

export const ArticleSettingsContent = styled(Box)({
  height: '100%',
  overflowX: 'hidden',
});

export const CustomAccordionSummary = styled(AccordionSummary)({
  '& .MuiAccordionSummary-content': {
    margin: '20px 0',
  },
});

export const ArticleLogoArea = styled(Box)({
  width: '100%',
  marginBottom: '20px',
  '& .article-logo-img': {
    borderRadius: '5px',
    objectFit: 'cover',
    width: '150px',
    margin: '5px 10px',
  },
});

export const ArticleSecondaryImageArea = styled(Box)({
  width: '100%',
  marginBottom: '20px',
  '& .article-secondary-img': {
    borderRadius: '5px',
    objectFit: 'cover',
    width: '180px',
    margin: '5px 10px',
  },
});

export const ArticleHeaderImageArea = styled(Box)({
  width: '100%',
  marginBottom: '20px',
  '& .article-header-img': {
    borderRadius: '5px',
    objectFit: 'cover',
    width: '225px',
    margin: '5px 10px',
  },
});

export const BoxSocialMedia = styled(Box)({
  display: 'flex',
  alignItems: 'baseline',
  width: '100%',
  '& .social-media-type': {
    marginRight: '30px',
    width: '120px',
  },
});

export const ImageAreaContainer = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  margin: '10px',
  width: '100%',
});

export const ImageArea = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  '& .remove-img': {
    position: 'absolute',
    alignSelf: 'flex-end',
    padding: '5px 10px 0 0',
  },
});
