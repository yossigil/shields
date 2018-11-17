import React from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import resolveBadgeUrl from '../lib/badge-url'
import { staticBadgeUrl } from '../../lib/make-badge-url'

const Badge = ({
  title,
  base,
  pattern,
  namedParams,
  exampleUrl,
  queryParams,
  preview,
  previewUrl,
  documentation,
  baseUrl,
  longCache,
  shouldDisplay = () => true,
  onClick,
}) => {
  const handleClick = onClick
    ? () =>
        onClick({
          title,
          base,
          pattern,
          namedParams,
          exampleUrl,
          queryParams,
          preview,
          previewUrl,
          documentation,
        })
    : undefined

  const serviceBase = base ? `${baseUrl}/${base}/` : baseUrl

  if (preview) {
    previewUrl = staticBadgeUrl({ baseUrl, ...preview })
  }
  const previewImage = previewUrl ? (
    <img
      className={classNames('badge-img', { clickable: onClick })}
      onClick={handleClick}
      src={resolveBadgeUrl(previewUrl, serviceBase, { longCache })}
      alt=""
    />
  ) : (
    '\u00a0'
  ) // non-breaking space

  const resolvedPattern = resolveBadgeUrl(pattern || previewUrl, serviceBase, {
    longCache: false,
  })

  if (shouldDisplay()) {
    return (
      <tr>
        <th
          className={classNames({ clickable: onClick })}
          onClick={handleClick}
        >
          {title}:
        </th>
        <td>{previewImage}</td>
        <td>
          <code
            className={classNames({ clickable: onClick })}
            onClick={handleClick}
          >
            {resolvedPattern}
          </code>
        </td>
      </tr>
    )
  }
  return null
}
Badge.propTypes = {
  title: PropTypes.string.isRequired,
  base: PropTypes.string,
  pattern: PropTypes.string,
  namedParams: PropTypes.object,
  exampleUrl: PropTypes.string,
  queryParams: PropTypes.object,
  preview: PropTypes.object,
  previewUrl: PropTypes.string,
  documentation: PropTypes.string,
  baseUrl: PropTypes.string,
  longCache: PropTypes.bool.isRequired,
  shouldDisplay: PropTypes.func,
  onClick: PropTypes.func.isRequired,
}

const Category = ({ category, examples, baseUrl, longCache, onClick }) => {
  if (examples.filter(example => example.shouldDisplay()).length === 0) {
    return null
  }
  return (
    <div>
      <Link to={`/examples/${category.id}`}>
        <h3 id={category.id}>{category.name}</h3>
      </Link>
      <table className="badge">
        <tbody>
          {examples.map(badgeData => (
            <Badge
              key={badgeData.key}
              {...badgeData}
              baseUrl={baseUrl}
              longCache={longCache}
              onClick={onClick}
            />
          ))}
        </tbody>
      </table>
    </div>
  )
}
Category.propTypes = {
  category: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
  }).isRequired,
  examples: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      base: PropTypes.string,
      pattern: PropTypes.string,
      namedParams: PropTypes.object,
      exampleUrl: PropTypes.string,
      queryParams: PropTypes.object,
      preview: PropTypes.object,
      previewUrl: PropTypes.string,
      documentation: PropTypes.string,
    })
  ).isRequired,
  baseUrl: PropTypes.string,
  longCache: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
}

const BadgeExamples = ({ categories, baseUrl, longCache, onClick }) => (
  <div>
    {categories.map((categoryData, i) => (
      <Category
        key={i}
        {...categoryData}
        baseUrl={baseUrl}
        longCache={longCache}
        onClick={onClick}
      />
    ))}
  </div>
)
BadgeExamples.propTypes = {
  categories: PropTypes.arrayOf(
    PropTypes.shape({
      category: Category.propTypes.category,
      examples: Category.propTypes.examples,
    })
  ),
  baseUrl: PropTypes.string,
  longCache: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
}

export { Badge, BadgeExamples }
