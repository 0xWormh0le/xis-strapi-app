import { Flex } from '@chakra-ui/core'
import * as React from 'react'
import { Check } from 'react-feather'
import { animated } from 'react-spring'
import { Transition } from 'react-spring/renderprops.cjs'
import { Text } from '../Typography'
import { InnerCircle, OuterCircle, SpacerLine, Square } from './styles'

type StepperProps = {
  activeStep: number
  stepInfo?: string[]
}

const AnimatedSpacer = animated(SpacerLine)
const AnimatedCheck = animated(Check)

const Stepper: React.FC<StepperProps> = ({ activeStep, stepInfo, children }) => {
  const childArr = React.Children.toArray(children)

  const stepCount = childArr.length

  const spacerRef = React.useRef<HTMLDivElement>(null)

  const [spacerWidth, setSpacerWidth] = React.useState(0)

  React.useEffect(() => {
    if (spacerRef && spacerRef.current) {
      setSpacerWidth(spacerRef.current.offsetWidth)
    }
  }, [])

  if (stepInfo && stepInfo.length > 0) {
    if (stepInfo.length !== stepCount) {
      throw Error("Stepper Error: Step info and number of steps don't match. Please update.")
    }
  }

  return (
    <React.Fragment>
      <Flex
        p={4}
        flex={1}
        flexDirection="row"
        alignItems="center"
        justifyContent={stepCount === 1 ? 'flex-end' : 'space-between'}
      >
        {childArr.map((_, i) => {
          const isCompletedStep = i < activeStep
          const isLastStep = i === stepCount - 1
          const isCurrentStep = i === activeStep
          return (
            <React.Fragment key={i}>
              {isCompletedStep ? (
                <Square>
                  <OuterCircle bg="primary.500">
                    <Transition
                      items={isCompletedStep}
                      from={{ transform: 'scale(0)' }}
                      enter={{ transform: 'scale(1)' }}
                      leave={{ transform: 'scale(0)' }}
                    >
                      {(isCompletedStep) =>
                        isCompletedStep &&
                        ((props) => <AnimatedCheck style={props} size={22} color="white" />)
                      }
                    </Transition>
                  </OuterCircle>
                </Square>
              ) : (
                <Square>
                  <OuterCircle bg={isCurrentStep ? 'primary.500' : 'gray.200'}>
                    <InnerCircle bg={isCurrentStep ? 'gray.200' : 'gray.100'}>
                      <Text color={isCompletedStep ? 'white' : 'black'}>{i + 1}</Text>
                    </InnerCircle>
                  </OuterCircle>
                </Square>
              )}
              {!isLastStep && (
                <Flex pos="relative" flexDirection="column" justifyContent="center" flex={1}>
                  <SpacerLine ref={spacerRef} bg="gray.100" />
                  <Transition
                    from={{ width: 0 }}
                    leave={{ width: 0 }}
                    items={isCompletedStep}
                    enter={{ width: spacerWidth }}
                  >
                    {(isCompletedStep) =>
                      isCompletedStep &&
                      ((props) => <AnimatedSpacer bg="primary.500" style={props} />)
                    }
                  </Transition>
                </Flex>
              )}
            </React.Fragment>
          )
        })}
      </Flex>
      <Flex px={4} flexDirection="row" justifyContent="space-around" width="100%">
        {stepInfo &&
          stepInfo.length > 0 &&
          stepInfo.map((step, i) => (
            <Flex
              key={i}
              flex={1}
              justifyContent="center"
              flexDirection="column"
              alignItems={
                i === 0 ? 'flex-start' : i === stepInfo.length - 1 ? 'flex-end' : 'center'
              }
            >
              <Text>{step}</Text>
            </Flex>
          ))}
      </Flex>
      {childArr[activeStep]}
    </React.Fragment>
  )
}

export default Stepper
