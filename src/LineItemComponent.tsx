import { BlockStack, Button, Disclosure, InlineStack, Text } from '@shopify/ui-extensions-react/checkout'
import type { CartBundleLineComponent, CartLine } from '@shopify/ui-extensions/build/ts/surfaces/checkout/api/standard/standard'
import type { Attribute } from '@shopify/ui-extensions/checkout'
import { type FC, useCallback, useMemo, useState } from 'react'

export interface FormattedLineItem extends CartBundleLineComponent {
  formattedAttributes: Attribute[]
}

export const LineItemComponent: FC<{ line: FormattedLineItem }> = ({ line }) => {
  return (
    <BlockStack spacing="none" key={line.id}>
      <InlineStack spacing="extraTight">
        {line.quantity > 1 && (
          <Text emphasis="bold">
            {line.quantity}
            {' '}
            x
          </Text>
        )}
        <Text>{line.merchandise.title}</Text>
      </InlineStack>
      {!!line.merchandise.subtitle && (
        <Text
          appearance="subdued"
          emphasis="bold"
          size="small"
        >
          {line.merchandise.subtitle}
        </Text>
      )}
      {!!line.formattedAttributes.length && (
        <BlockStack spacing="none" padding={['none', 'none', 'none', 'base']}>
          {line.formattedAttributes.map(attr => (
            <Text key={attr.key} appearance="subdued" size="small">
              {attr.key}
              :
              {' '}
              {attr.value}
            </Text>
          ))}
        </BlockStack>
      )}
    </BlockStack>
  )
}

export const LineItemComponentsList: FC<{ cartLine: CartLine, logger: Logger }> = ({ cartLine, logger }) => {
  // Create an array of components that **excludes** the parent line item
  const lineComponents = useMemo(() => {
    return cartLine.lineComponents.flatMap((line) => {
      const groupType = cartLine.attributes.find(attr => attr.key === '_group_type')
      const isParent = line.merchandise?.id === cartLine.merchandise?.id

      // Hide bundle parent from list, as we use it for the parent group
      if (groupType?.value === 'bundle' && isParent) {
        return []
      }

      const formattedAttributes = line.attributes.filter(attr => !attr.key.startsWith('_')).sort((a, b) => a.key.localeCompare(b.key))

      return [{
        ...line,
        formattedAttributes,
      }]
    })
  }, [cartLine])

  const [open, toggleOpen] = useState<string[]>([])
  const handleOnToggle = useCallback((values: string[]) => toggleOpen(values), [])

  const buttonText = useMemo(() => {
    const stateKey = open.length ? 'Hide' : 'View'

    const groupType = cartLine.attributes.find(attr => attr.key === '_group_type')?.value

    const groupValue = groupType === 'bundle' ? 'Bundle' : groupType === 'options' ? 'Options' : 'Items'

    return `${stateKey} ${groupValue}`
  }, [cartLine, open])

  if (!lineComponents.length) {
    return
  }

  return (
    <Disclosure
      open={open}
      onToggle={handleOnToggle}
    >
      <Button
        inlineAlignment="start"
        appearance="monochrome"
        kind="plain"
        toggles="items"
      >
        {buttonText}
      </Button>
      <BlockStack
        id="items"
        spacing="base"
        padding={['tight', 'none', 'loose', 'none']}
      >
        {lineComponents.flatMap((line, _index, _lineComponents) => {
          // if (index === lineComponents.length - 1) {
          //   return <LineItemComponent line={line} key={line.id} />
          // }

          return [
            <LineItemComponent line={line} key={`${line.id}-comp`} />,
            // <Divider key={`${line.id}-divider`} size='small' />,
          ]
        })}
      </BlockStack>
    </Disclosure>
  )
}
