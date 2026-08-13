import { addons } from 'storybook/manager-api'
import { defaultConfig, type TagBadgeParameters } from 'storybook-addon-tag-badges/manager-helpers'

addons.setConfig({
  tagBadges: [
    {
      tags: 'api-ref',
      badge: {
        text: 'API',
        style: 'grey',
      },
      display: {
        sidebar: [{ type: 'story', skipInherited: false }],
        toolbar: true,
        mdx: true,
      },
    },
    {
      tags: 'highlight',
      badge: {
        text: 'Highlight',
        style: 'blue',
      },
      display: {
        sidebar: [{ type: 'story', skipInherited: false }],
        toolbar: true,
        mdx: true,
      },
    },
    {
      tags: 'anatomy',
      badge: {
        text: 'Anatomy',
        style: 'red',
      },
      display: {
        sidebar: [{ type: 'story', skipInherited: false }],
        toolbar: true,
        mdx: true,
      },
    },
    {
      tags: 'examples',
      badge: {
        text: 'Example 👀',
        style: 'green',
      },
      display: {
        sidebar: [{ type: 'story', skipInherited: false }],
        toolbar: true,
        mdx: true,
      },
    },
    {
      tags: 'tests',
      badge: {
        text: 'Test 🧪',
        style: 'orange',
      },
      display: {
        sidebar: [{ type: 'story', skipInherited: false }],
        toolbar: true,
        mdx: true,
      },
    },
    {
      tags: 'animation',
      badge: {
        text: 'Animation 🎬',
        style: 'purple',
      },
      display: {
        sidebar: [{ type: 'story', skipInherited: false }],
        toolbar: true,
        mdx: true,
      },
    },
    {
      tags: 'showcase',
      badge: {
        text: 'Showcase',
        style: {
          backgroundColor: '#fc9ec5',
          borderColor: '#fe7bb2',
          color: '#161314',
        },
      },
      display: {
        sidebar: [{ type: 'story', skipInherited: false }],
        toolbar: true,
        mdx: true,
      },
    },
    ...defaultConfig,
  ] satisfies TagBadgeParameters,
})
