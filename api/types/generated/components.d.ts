import type { Schema, Attribute } from '@strapi/strapi';

export interface SharedSeo extends Schema.Component {
  collectionName: 'components_shared_seo';
  info: {
    displayName: 'SEO';
    icon: 'search';
  };
  attributes: {
    metaTitle: Attribute.String &
      Attribute.SetMinMaxLength<{
        maxLength: 60;
      }>;
    metaDescription: Attribute.Text &
      Attribute.SetMinMaxLength<{
        maxLength: 160;
      }>;
    ogImage: Attribute.Media<'images'>;
  };
}

export interface ContentServiceItem extends Schema.Component {
  collectionName: 'components_content_service_items';
  info: {
    displayName: 'Service Item';
    icon: 'bulletList';
  };
  attributes: {
    label: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        maxLength: 200;
      }>;
  };
}

declare module '@strapi/types' {
  export module Shared {
    export interface Components {
      'shared.seo': SharedSeo;
      'content.service-item': ContentServiceItem;
    }
  }
}
