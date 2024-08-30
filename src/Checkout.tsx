import { BlockStack, Text, reactExtension, useCartLineTarget, useSettings } from '@shopify/ui-extensions-react/checkout'
import { useMemo } from 'react'
import { LineItemComponentsList } from './LineItemComponent'

/**
 * ! The below target doesn't seem to be available on production stores
 */

export default reactExtension('purchase.cart-line-item.line-components.render', () => <Extension />)

type Settings = {
  shipping_timeline_key?: string
}


function Extension() {
  const settings = useSettings<Settings>()
  const cartLine = useCartLineTarget()

  const shippingTimelineKey = useMemo(() => settings.shipping_timeline_key ?? '_shipping_timeline', [settings])

  const shippingTimeline = useMemo(() => {
    const shippingTimeline = cartLine.attributes.find(attr => attr.key === shippingTimelineKey)
    return shippingTimeline?.value ?? ''
  }, [cartLine, shippingTimelineKey])

  return (
    <BlockStack spacing="extraTight">
      {!!shippingTimeline && (
        <Text appearance="decorative">
          {shippingTimeline}
        </Text>
      )}
      <LineItemComponentsList cartLine={cartLine} logger={logger} />
    </BlockStack>
  )
}
