import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { articleType } from '@/types';

import {
  ExpansionPanel,
  ExpansionPanelDetails,
  Icon,
  Typography,
  TextField,
  InputAdornment,
  FormControl,
  Select,
  InputLabel,
  MenuItem,
  Box,
  Button,
} from '@material-ui/core';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { CODER_MIND_URL } from '@/config/dataProperties';
import { formatCustomURL } from '@/config/masks';
import { isValidLink } from '@/shared';
import { callToast as toastEmitter } from '@/redux/toast/toastActions';
import { error } from '@/config/toasts';

import {
  FaYoutube,
  FaVideo,
  FaGitlab,
  FaGithub,
  FaStore,
} from 'react-icons/fa';

import { CustomTooltip } from '@/components/styles';
import { CustomExpansionPanelSummary, BoxSocialMedia } from './styles';

function ArticleMoreOptions(props) {
  const {
    article,
    open,
    close,
    expanded,
    onSaveChanges,
    callToast,
  } = props;

  const [mounted, setMounted] = useState(false);
  const [openTooltip, setOpenTooltip] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const [socialRepository, setSocialRepository] = useState('');
  const [socialRepositoryType, setSocialRepositoryType] = useState('github');
  const [socialVideo, setSocialVideo] = useState('');
  const [socialVideoType, setSocialVideoType] = useState('youtube');
  const [customUri, setCustomUri] = useState('');

  function toogleDetails() {
    if (!expanded) {
      open('moreOptions');
    } else {
      close();
    }
  }

  function getRepoTypeIcon() {
    switch (socialRepositoryType) {
      case 'github': return (<FaGithub />);
      case 'gitlab': return (<FaGitlab />);
      default: return (<FaStore />);
    }
  }

  function getVideoTypeIcon() {
    return (socialVideoType === 'youtube' ? <FaYoutube /> : <FaVideo />);
  }

  function changeSocialRepositoryType(evt) {
    const { value } = evt.target;
    setSocialRepository('');
    setSocialRepositoryType(value);
  }

  function changeSocialVideoType(evt) {
    const { value } = evt.target;
    setSocialVideo('');
    setSocialVideoType(value);
  }

  function changeCustomUri(evt) {
    const { value } = evt.target;
    setCustomUri(value);
    setOpenTooltip(true);
  }

  function hideCustomUriTooltip() {
    setOpenTooltip(false);
  }

  function validateChanges() {
    if (socialVideo && !isValidLink(socialVideo)) {
      throw new Error('Vídeo possui um link inválido');
    }

    if (socialRepository && !isValidLink(socialRepository)) {
      throw new Error('Repositório possui um link inválido');
    }
  }

  function saveChanges() {
    try {
      validateChanges();

      const articleChanges = {
        socialRepository,
        socialRepositoryType,
        socialVideo,
        socialVideoType,
        customUri,
      };
      onSaveChanges(articleChanges);
      setIsSaved(true);
    } catch (err) {
      callToast(error(err.message));
    }
  }

  useEffect(() => {
    if (isSaved) {
      setTimeout(() => {
        setIsSaved(false);
      }, 2000);
    }
  }, [isSaved]);

  useEffect(() => {
    if (article._id && !mounted) {
      setMounted(true);
      setSocialRepository(article.socialRepository);
      setSocialRepositoryType(article.socialRepositoryType);
      setSocialVideo(article.socialVideo);
      setSocialVideoType(article.socialVideoType);
      setCustomUri(article.customUri);
    }
  }, [article, socialRepository, socialRepositoryType, socialVideo, socialVideoType, mounted]);

  return (
    <ExpansionPanel expanded={expanded}>
      <CustomExpansionPanelSummary
        onClick={toogleDetails}
        expandIcon={<Icon>expand_more</Icon>}
      >
        <Typography variant="h6" component="h2">Mais opções</Typography>
      </CustomExpansionPanelSummary>
      <ExpansionPanelDetails>
        <Box>
          <BoxSocialMedia>
            <CustomTooltip
              placement="top-start"
              arrow
              open={openTooltip}
              title={(
                <Typography component="span" variant="caption">
                  A url do artigo ficará:
                  {' '}
                  {CODER_MIND_URL}
                  /artigos/
                  <strong>{customUri ? formatCustomURL(customUri) : ''}</strong>
                </Typography>
          )}
            >
              <TextField
                label="Url Personalizada"
                margin="dense"
                fullWidth
                value={customUri}
                onChange={changeCustomUri}
                onBlur={hideCustomUriTooltip}
              />
            </CustomTooltip>
          </BoxSocialMedia>
          <BoxSocialMedia>
            <TextField
              label="Repositório"
              margin="dense"
              error={false}
              helperText={(
                <Typography component="span" variant="caption">
                  <strong>Informe o link completo do repositório</strong>
                </Typography>
          )}
              value={socialRepository || ''}
              onChange={(evt) => setSocialRepository(evt.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    {getRepoTypeIcon()}
                  </InputAdornment>
                ),
              }}
            />
            <FormControl className="social-media-type">
              <InputLabel>Tipo</InputLabel>
              <Select
                value={socialRepositoryType || 'github'}
                onChange={changeSocialRepositoryType}
              >
                <MenuItem value="github">GitHub</MenuItem>
                <MenuItem value="gitlab">GitLab</MenuItem>
                <MenuItem value="other">Outro</MenuItem>
              </Select>
            </FormControl>
          </BoxSocialMedia>
          <BoxSocialMedia>
            <TextField
              label="Video"
              margin="dense"
              error={false}
              helperText={(
                <Typography component="span" variant="caption">
                  <strong>Informe o link completo do video</strong>
                </Typography>
          )}
              value={socialVideo || ''}
              onChange={(evt) => setSocialVideo(evt.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    {getVideoTypeIcon()}
                  </InputAdornment>
                ),
              }}
            />
            <FormControl className="social-media-type">
              <InputLabel>Tipo</InputLabel>
              <Select
                value={socialVideoType || 'youtube'}
                onChange={changeSocialVideoType}
              >
                <MenuItem value="youtube">Youtube</MenuItem>
                <MenuItem value="other">Outro</MenuItem>
              </Select>
            </FormControl>
          </BoxSocialMedia>
          <Box
            width="100%"
            display="flex"
            justifyContent="flex-end"
            alignItems="center"
            marginY={2}
          >
            {!isSaved && (
              <Button
                size="small"
                color="primary"
                variant="contained"
                onClick={saveChanges}
              >
                Salvar

              </Button>
            )}
          </Box>

        </Box>
      </ExpansionPanelDetails>
    </ExpansionPanel>
  );
}

ArticleMoreOptions.propTypes = {
  article: articleType.isRequired,
  open: PropTypes.func.isRequired,
  close: PropTypes.func.isRequired,
  onSaveChanges: PropTypes.func.isRequired,
  callToast: PropTypes.func.isRequired,
  expanded: PropTypes.bool,
};

ArticleMoreOptions.defaultProps = {
  expanded: false,
};

const mapStateToProps = (state) => ({ toast: state.config });

const mapDispatchToProps = (dispatch) => bindActionCreators({ callToast: toastEmitter }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(ArticleMoreOptions);