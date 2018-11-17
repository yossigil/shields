import React from 'react'
import PropTypes from 'prop-types'
import Modal from 'react-modal'
import ClickToSelect from '@mapbox/react-click-to-select'
import { advertisedStyles } from '../../supported-features.json'
import { makeBadgeUrlFromPattern } from '../../lib/make-badge-url'
import resolveBadgeUrl from '../lib/badge-url'
import generateAllMarkup from '../lib/generate-image-markup'

export default class MarkupModal extends React.Component {
  static propTypes = {
    example: PropTypes.shape({
      title: PropTypes.string.isRequired,
      base: PropTypes.string,
      pattern: PropTypes.string,
      namedParams: PropTypes.object,
      exampleUrl: PropTypes.string,
      queryParams: PropTypes.object,
      preview: PropTypes.object,
      previewUrl: PropTypes.string,
      documentation: PropTypes.string,
      link: PropTypes.string,
    }),
    baseUrl: PropTypes.string.isRequired,
    onRequestClose: PropTypes.func.isRequired,
  }

  state = {
    exampleUrl: null,
    badgeUrl: null,
    link: '',
    style: 'flat',
  }

  constructor(props) {
    super(props)

    // Transfer `badgeUrl` and `link` into state so they can be edited by the
    // user.
    const { example, baseUrl } = props
    if (example) {
      const { base, pattern, previewUrl, link } = example
      const serviceBase = base ? `${baseUrl}/${base}/` : baseUrl
      this.state = {
        ...this.state,
        badgeUrl: resolveBadgeUrl(
          pattern || previewUrl,
          serviceBase || window.location.href
        ),
        link: link || '',
      }
    }
  }

  get isOpen() {
    return this.props.example !== null
  }

  generateLivePreviewUrl() {
    const { baseUrl } = this.props
    const { badgeUrl, style } = this.state

    return resolveBadgeUrl(
      badgeUrl,
      baseUrl || window.location.href,
      // Default style doesn't need to be specified.
      style === 'flat' ? undefined : { style }
    )
  }

  generateMarkup() {
    if (!this.isOpen) {
      return {}
    }

    const { title } = this.props.example
    const { link } = this.state
    const livePreviewUrl = this.generateLivePreviewUrl()
    return generateAllMarkup(livePreviewUrl, link, title)
  }

  renderDocumentation() {
    if (!this.isOpen) {
      return null
    }

    const { documentation } = this.props.example
    return documentation ? (
      <div>
        <h4>Documentation</h4>
        <div dangerouslySetInnerHTML={{ __html: documentation }} />
      </div>
    ) : null
  }

  render() {
    if (!this.isOpen) {
      return (
        <Modal
          isOpen={this.isOpen}
          onRequestClose={this.props.onRequestClose}
          contentLabel="Example Modal"
        />
      )
    }

    const { baseUrl } = this.props
    const {
      example: { base, pattern, namedParams, exampleUrl },
    } = this.props

    const serviceBase = base ? `${baseUrl}/${base}/` : baseUrl

    const { markdown, reStructuredText, asciiDoc } = this.generateMarkup()

    const livePreviewUrl = this.isOpen
      ? this.generateLivePreviewUrl()
      : undefined

    let exampleUrlToRender
    if (namedParams) {
      exampleUrlToRender = resolveBadgeUrl(
        makeBadgeUrlFromPattern({
          base,
          pattern,
          namedParams,
        }),
        serviceBase || window.location.href
      )
    } else if (exampleUrl) {
      exampleUrlToRender = resolveBadgeUrl(
        exampleUrl,
        serviceBase || window.location.href
      )
    }

    return (
      <Modal
        isOpen={this.isOpen}
        onRequestClose={this.props.onRequestClose}
        contentLabel="Example Modal"
      >
        <form action="">
          <p>
            <img className="badge-img" src={livePreviewUrl} />
          </p>
          <p>
            <label>
              Link&nbsp;
              <input
                type="url"
                value={this.state.link}
                onChange={event => {
                  this.setState({ link: event.target.value })
                }}
              />
            </label>
          </p>
          <p>
            <label>
              Image&nbsp;
              <input
                type="url"
                value={this.state.badgeUrl}
                onChange={event => {
                  this.setState({ badgeUrl: event.target.value })
                }}
              />
            </label>
          </p>
          {exampleUrlToRender && (
            <p>
              Example&nbsp;
              <ClickToSelect>
                <input
                  className="code clickable"
                  readOnly
                  value={exampleUrlToRender}
                />
              </ClickToSelect>
            </p>
          )}
          <p>
            <label>
              Style&nbsp;
              <select
                value={this.state.style}
                onChange={event => {
                  this.setState({ style: event.target.value })
                }}
              >
                {advertisedStyles.map(style => (
                  <option key={style} value={style}>
                    {style}
                  </option>
                ))}
              </select>
            </label>
          </p>
          <p>
            Markdown&nbsp;
            <ClickToSelect>
              <input className="code clickable" readOnly value={markdown} />
            </ClickToSelect>
          </p>
          <p>
            reStructuredText&nbsp;
            <ClickToSelect>
              <input
                className="code clickable"
                readOnly
                value={reStructuredText}
              />
            </ClickToSelect>
          </p>
          <p>
            AsciiDoc&nbsp;
            <ClickToSelect>
              <input className="code clickable" readOnly value={asciiDoc} />
            </ClickToSelect>
          </p>
          {this.renderDocumentation()}
        </form>
      </Modal>
    )
  }
}
