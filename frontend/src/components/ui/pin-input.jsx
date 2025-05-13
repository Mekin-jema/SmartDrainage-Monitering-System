import * as React from 'react'
import { cn } from '@/lib/utils'

const PinInputContext = React.createContext(false)

const PinInput = ({ className, children, ref, ...props }) => {
  const {
    defaultValue,
    value,
    onChange,
    onComplete,
    onIncomplete,
    placeholder = '○',
    type = 'alphanumeric',
    name,
    form,
    otp = false,
    mask = false,
    disabled = false,
    readOnly = false,
    autoFocus = false,
    ariaLabel = '',
    ...rest
  } = props

  const validChildren = getValidChildren(children)

  const length = getInputFieldCount(children)

  const { pins, pinValue, refMap, ...handlers } = usePinInput({
    value,
    defaultValue,
    placeholder,
    type,
    length,
    readOnly,
  })

  React.useEffect(() => {
    if (!onChange) return
    onChange(pinValue)
  }, [onChange, pinValue])

  const completeRef = React.useRef(pinValue.length === length)
  React.useEffect(() => {
    if (pinValue.length === length && completeRef.current === false) {
      completeRef.current = true
      if (onComplete) onComplete(pinValue)
    }
    if (pinValue.length !== length && completeRef.current === true) {
      completeRef.current = false
      if (onIncomplete) onIncomplete(pinValue)
    }
  }, [length, onComplete, onIncomplete, pinValue, pins, value])

  React.useEffect(() => {
    if (!autoFocus) return
    const node = refMap?.get(0)
    if (node) {
      node.focus()
    }
  }, [autoFocus, refMap])

  const skipRef = React.useRef(0)
  let counter = 0
  const clones = validChildren.map((child) => {
    if (child.type === PinInputField) {
      const pinIndex = counter
      counter = counter + 1
      return React.cloneElement(child, {
        name,
        inputKey: `input-${pinIndex}`,
        value: length > pinIndex ? pins[pinIndex] : '',
        onChange: (e) => handlers.handleChange(e, pinIndex),
        onFocus: (e) => handlers.handleFocus(e, pinIndex),
        onBlur: () => handlers.handleBlur(pinIndex),
        onKeyDown: (e) => handlers.handleKeyDown(e, pinIndex),
        onPaste: (e) => handlers.handlePaste(e),
        placeholder: placeholder,
        type: type,
        mask: mask,
        autoComplete: otp ? 'one-time-code' : 'off',
        disabled: disabled,
        readOnly: readOnly,
        'aria-label': ariaLabel
          ? ariaLabel
          : `Pin input ${counter} of ${length}`,
        ref: (node) => {
          if (node) {
            refMap?.set(pinIndex, node)
          } else {
            refMap?.delete(pinIndex)
          }
        },
      })
    }
    skipRef.current = skipRef.current + 1
    return child
  })

  return (
    <PinInputContext.Provider value={true}>
      <div ref={ref} aria-label="Pin Input" className={className} {...rest}>
        {clones}
        <input type="hidden" name={name} form={form} value={pinValue} />
      </div>
    </PinInputContext.Provider>
  )
}
PinInput.displayName = 'PinInput'

const PinInputField = ({
  className,
  component,
  ...props
}) => {
  const { mask, type, inputKey, ...rest } = props

  const isInsidePinInput = React.useContext(PinInputContext)
  if (!isInsidePinInput) {
    throw new Error(
      `PinInputField must be used within ${PinInput.displayName}.`,
    )
  }

  const Element = component || 'input'

  return (
    <Element
      key={inputKey}
      type={mask ? 'password' : type === 'numeric' ? 'tel' : 'text'}
      inputMode={type === 'numeric' ? 'numeric' : 'text'}
      className={cn('size-10 text-center', className)}
      {...rest}
    />
  )
}

const usePinInput = ({
  value,
  defaultValue,
  placeholder,
  type,
  length,
  readOnly,
}) => {
  const pinInputs = React.useMemo(
    () =>
      Array.from({ length }, (_, index) =>
        defaultValue
          ? defaultValue.charAt(index)
          : value
            ? value.charAt(index)
            : '',
      ),
    [defaultValue, length, value],
  )

  const [pins, setPins] = React.useState(pinInputs)
  const pinValue = pins.join('').trim()

  React.useEffect(() => {
    setPins(pinInputs)
  }, [pinInputs])

  const itemsRef = React.useRef(null)

  function getMap() {
    if (!itemsRef.current) {
      itemsRef.current = new Map()
    }
    return itemsRef.current
  }

  function getNode(index) {
    const map = getMap()
    const node = map?.get(index)
    return node
  }

  function focusInput(itemId) {
    const node = getNode(itemId)
    if (node) {
      node.focus()
      node.placeholder = ''
    }
  }

  function handleFocus(event, index) {
    event.target.select()
    focusInput(index)
  }

  function handleBlur(index) {
    const node = getNode(index)
    if (node) {
      node.placeholder = placeholder
    }
  }

  function updateInputField(val, index) {
    const node = getNode(index)

    if (node) {
      node.value = val
    }

    setPins((prev) =>
      prev.map((p, i) => {
        if (i === index) {
          return val
        }
        return p
      }),
    )
  }

  function validate(value) {
    const NUMERIC_REGEX = /^[0-9]+$/
    const ALPHA_NUMERIC_REGEX = /^[a-zA-Z0-9]+$/i
    const regex = type === 'alphanumeric' ? ALPHA_NUMERIC_REGEX : NUMERIC_REGEX
    return regex.test(value)
  }

  const pastedVal = React.useRef(null)
  function handleChange(e, index) {
    const inputValue = e.target.value
    const pastedValue = pastedVal.current
    const inputChar =
      pastedValue && pastedValue.length === length
        ? pastedValue.charAt(length - 1)
        : inputValue.slice(-1)

    if (validate(inputChar)) {
      updateInputField(inputChar, index)
      pastedVal.current = null
      if (inputValue.length > 0) {
        focusInput(index + 1)
      }
    }
  }

  function handlePaste(event) {
    event.preventDefault()
    const copyValue = event.clipboardData
      .getData('text/plain')
      .replace(/[\n\r\s]+/g, '')
    const copyArr = copyValue.split('').slice(0, length)

    const isValid = copyArr.every((c) => validate(c))

    if (!isValid) return

    for (let i = 0; i < length; i++) {
      if (i < copyArr.length) {
        updateInputField(copyArr[i], i)
      }
    }

    pastedVal.current = copyValue
    focusInput(copyArr.length < length ? copyArr.length : length - 1)
  }

  function handleKeyDown(event, index) {
    const { ctrlKey, key, shiftKey, metaKey } = event

    if (type === 'numeric') {
      const canTypeSign =
        key === 'Backspace' ||
        key === 'Tab' ||
        key === 'Control' ||
        key === 'Delete' ||
        (ctrlKey && key === 'v') ||
        (metaKey && key === 'v')
          ? true
          : !Number.isNaN(Number(key))

      if (!canTypeSign || readOnly) {
        event.preventDefault()
      }
    }

    if (key === 'ArrowLeft' || (shiftKey && key === 'Tab')) {
      event.preventDefault()
      focusInput(index - 1)
    } else if (key === 'ArrowRight' || key === 'Tab' || key === ' ') {
      event.preventDefault()
      focusInput(index + 1)
    } else if (key === 'Delete') {
      event.preventDefault()
    } else if (key === 'Backspace') {
      event.preventDefault()
      updateInputField('', index)
      if ((event.target).value === '') {
        focusInput(index - 1)
      }
    }
  }

  return {
    pins,
    pinValue,
    refMap: getMap(),
    handleFocus,
    handleBlur,
    handleChange,
    handlePaste,
    handleKeyDown,
  }
}

const getValidChildren = (children) =>
  React.Children.toArray(children).filter((child) => {
    if (React.isValidElement(child)) {
      return React.isValidElement(child)
    }
    throw new Error(`${PinInput.displayName} contains invalid children.`)
  })

const getInputFieldCount = (children) =>
  React.Children.toArray(children).filter((child) => {
    if (React.isValidElement(child) && child.type === PinInputField) {
      return React.isValidElement(child)
    }
  }).length

export { PinInput, PinInputField }
