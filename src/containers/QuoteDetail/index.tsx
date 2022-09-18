import { Flex, Button, useToast, Box, FormLabel, Switch } from '@chakra-ui/core'
import get from 'lodash/get'
import React, { useState, useEffect } from 'react'
import { RouteComponentProps, useHistory } from 'react-router'
import {
  Container,
  Card,
  ModalWrap,
  Table,
  ConnectedAsyncSelect,
  ConnectedFormGroup,
  ConnectedTable
} from '../../components'
import {
  useUpdateQuoteMutation,
  useDeleteQuoteMutation,
  Enum_Quote_Status,
  useCreateDocumentMutation,
  useDeleteDocumentMutation,
  GetItemsDocument,
  GetItemTypesDocument,
  useGetQuoteQuery,
  Quote
} from '../../generated/graphql'
import { PageWrap } from '../../layouts'
import { theme } from '../../theme/index'
import { Text } from '../../components/Typography'
import { Field, Form, Formik, FormikProps } from 'formik'
import moment from 'moment'
import * as Yup from 'yup'
import { ConnectedTextArea } from '../../components'
import Uppy from '@uppy/core'
import XHRUpload from '@uppy/xhr-upload'
import { Dashboard } from '@uppy/react'
import { tokenStorage } from '../../utils'
import { Cell } from 'react-table'
import { Trash2, Edit2 } from 'react-feather'
import '@uppy/core/dist/style.css'
import '@uppy/core/dist/style.css'
import '@uppy/dashboard/dist/style.css'
import '@uppy/status-bar/dist/style.css'

type MatchParams = {
  idTicket: string
  idQuote: string
}

type UserDetailProps = RouteComponentProps<MatchParams>

type DocumentUploads = {
  id: string
  name: string
  created_at: Date
}

type Items = {
  id: string
  item: any
  description: string
  quantity: number
  unitPrice: number
  totalPrice: number
}

type ItemsData = {
  id: string
  item: any
  description: string
  quantity: number
  unitPrice: number
  totalPrice: number
  itemType: any
}

const QuoteFormValidation = Yup.object().shape({
  documents: Yup.array().required('File uploads are required')
})

const ItemsFormValidation = Yup.object().shape({
  item: Yup.string().required('Item is required'),
  description: Yup.string().required('Description is required'),
  unitPrice: Yup.number().required('Unit Price is required'),
  quantity: Yup.number().required('Quantity is required')
})

const QuoteDetail: React.FC<UserDetailProps> = ({ match: { params } }) => {
  const { idTicket, idQuote } = params
  const { data, refetch } = useGetQuoteQuery({
    variables: { quoteId: idQuote }
  })

  const quote: Quote | null | undefined = get(data, 'quote', undefined)

  const items = quote?.items
  const docs = quote?.documents

  const history = useHistory()
  const [updateQuote] = useUpdateQuoteMutation()
  const [deleteQuote] = useDeleteQuoteMutation()
  const [createDocument] = useCreateDocumentMutation()
  const [deleteDocument] = useDeleteDocumentMutation()
  const currentDate = moment().format('YYYY-MM-DD')
  const expiryDate = moment(currentDate)
    .add(1, 'M')
    .format('YYYY-MM-DD')
  const { colors } = theme
  const [showModal, setShowModal] = useState(false)
  const [showCloseModal, setShowCloseModal] = useState(false)
  const [showModalItems, setShowModalItems] = useState(false)
  const [tableView, setTableView] = useState(false)
  const [modalTitle, setModalTitle] = useState()
  const [documents, setDocuments] = useState<string[]>([])
  const [documentData, setDocumentData] = useState<any[]>([])
  const [deletedDocumentData, setDeletedDocumentData] = useState<string[]>([])
  const [itemData, setItemData] = useState<any[]>([])
  const [itemUpdate, setItemUpdate] = useState()
  const toast = useToast()

  useEffect(() => {
    if (items && items.length > 0) {
      setItemData(items)
    }

    if (docs) {
      setDocumentData(docs)

      docs.map((doc) => {
        if (doc && doc.id) {
          if (!documents.includes(doc.id)) {
            documents.push(doc?.id)
            setDocuments(documents)
          }
        }

        return documents
      })
    }
  }, [items, setItemData, documentData, setDocumentData, documents, setDocuments, docs])

  const INITIAL_VALUES = {
    termsAndConditions: quote?.termsAndConditions,
    documents: documents || []
  }

  const INITIAL_VALUES_ITEMS = {
    item: {
      label: itemUpdate?.item?.name || 'Select Item',
      value: {
        id: itemUpdate?.item?.id || 0,
        description: itemUpdate?.item?.description || '',
        name: itemUpdate?.item?.name || '',
        recommendedUnitPrice: itemUpdate?.item?.recommendedUnitPrice || 0
      }
    },
    id: itemUpdate?.id || '',
    description: itemUpdate?.description || '',
    unitPrice: itemUpdate?.unitPrice || 0,
    quantity: itemUpdate?.quantity || 1,
    itemType: { label: 'Selected Item Type', value: { id: 0, description: '', name: '' } }
  }

  const uppy = (setFieldValue: any) => {
    return Uppy({
      autoProceed: false,
      allowMultipleUploads: true,
      restrictions: {
        maxFileSize: null,
        maxNumberOfFiles: 100,
        allowedFileTypes: ['image/*', 'application/pdf', '.doc', '.docx', '.xls', '.xlsx']
      }
    })
      .use(XHRUpload, {
        endpoint: process.env.REACT_APP_API_HOST
          ? process.env.REACT_APP_API_HOST + '/upload'
          : '/upload',
        fieldName: 'files',
        headers: {
          Authorization: `Bearer ${tokenStorage.get()?.jwt}`
        }
      })
      .on('upload-success', async (file, response) => {
        try {
          setDocumentData(documentData)
          await createDocument({
            variables: {
              input: {
                name: file.name,
                file: response.body[0].id,
                from: 'quote'
              }
            }
          }).then((res: any) => {
            if (res && res.data) {
              const fileId = res.data.createDocument.document.id
              documents.push(fileId)
              setDocuments(documents)
              setFieldValue('documents', documents)
              documentData.push({
                file: {
                  url: res.data.createDocument.document.file.url,
                  __typename: res.data.createDocument.document.file.__typename
                },
                id: res.data.createDocument.document.id,
                name: response.body[0].name,
                __typename: res.data.createDocument.document.__typename
              })
            }
          })
        } catch (error) {
          toast({
            description: 'Something went wrong while uploading your document.'
          })
        }
      })
  }

  const RenderName = ({ row: { original } }: Cell<DocumentUploads>) => {
    return (
      <Flex justifyContent="center" flexDirection="column" alignItems="flex-start">
        <Text>{original.name}</Text>
      </Flex>
    )
  }

  const RenderCreatedAt = ({ row: { original } }: Cell<DocumentUploads>) => {
    return (
      <Flex justifyContent="center" flexDirection="column" alignItems="flex-start">
        <Text>{moment(original.created_at).format('YYYY-MM-DD')}</Text>
      </Flex>
    )
  }

  const DeleteRow = async (fileId: string) => {
    deletedDocumentData.push(fileId)
    setDeletedDocumentData(deletedDocumentData)
    const updatedDocumentData: any = []
    documentData.map((file) => {
      if (file.id !== fileId) {
        return updatedDocumentData.push(file)
      }

      return documentData
    })

    await deleteDocument({
      variables: {
        id: fileId
      }
    })

    return toast({
      description: 'File deleted successfully.'
    })
  }

  const RenderDelete = ({ row: { original } }: Cell<DocumentUploads>) => {
    return (
      <Flex justifyContent="center" flexDirection="column" alignItems="flex-start">
        <Button
          title="Delete"
          onClick={() => DeleteRow(original.id)}
          isDisabled={Enum_Quote_Status.Sent === quote?.status ? true : false}
        >
          <Trash2 size={20} color="black" />
        </Button>
      </Flex>
    )
  }

  const Columns = [
    {
      Header: 'Name',
      accessor: 'name',
      Cell: RenderName
    },
    {
      Header: 'Date Added',
      accessor: 'createdAt',
      Cell: RenderCreatedAt
    },
    {
      Header: 'Delete',
      accessor: 'delete',
      Cell: RenderDelete
    }
  ]

  const RenderItem = ({ row: { original } }: Cell<ItemsData>) => {
    return (
      <Flex justifyContent="center" flexDirection="column" alignItems="flex-start">
        <Text>{original.item?.name}</Text>
      </Flex>
    )
  }

  const RenderDescription = ({ row: { original } }: Cell<ItemsData>) => {
    return (
      <Flex justifyContent="center" flexDirection="column" alignItems="flex-start">
        <Text>{original.description}</Text>
      </Flex>
    )
  }

  const RenderQuantity = ({ row: { original } }: Cell<ItemsData>) => {
    return (
      <Flex justifyContent="center" flexDirection="column" alignItems="flex-start">
        <Text>{original.quantity}</Text>
      </Flex>
    )
  }

  const RenderUnitPrice = ({ row: { original } }: Cell<ItemsData>) => {
    return (
      <Flex justifyContent="center" flexDirection="column" alignItems="flex-start">
        <Text>R {(Math.round(original.unitPrice * 100) / 100).toFixed(2)}</Text>
      </Flex>
    )
  }

  const RenderItemType = ({ row: { original } }: Cell<ItemsData>) => {
    return (
      <Flex justifyContent="center" flexDirection="column" alignItems="flex-start">
        <Text>{original.itemType.name}</Text>
      </Flex>
    )
  }

  const RenderTotalPrice = ({ row: { original } }: Cell<ItemsData>) => {
    const newTotalPrice = original.quantity * original.unitPrice
    original.totalPrice = newTotalPrice

    return (
      <Flex justifyContent="center" flexDirection="column" alignItems="flex-start">
        <Text>R {(Math.round(original.totalPrice * 100) / 100).toFixed(2)}</Text>
      </Flex>
    )
  }

  const RenderItemDelete = ({ row: { original } }: Cell<ItemsData>) => {
    return (
      <Flex justifyContent="center" flexDirection="column" alignItems="flex-start">
        <Button
          title="Delete"
          onClick={() => setItemData((prevData) => prevData.filter((x) => x.id !== original.id))}
          isDisabled={Enum_Quote_Status.Sent === quote?.status ? true : false}
        >
          <Trash2 size={20} color="black" />
        </Button>
      </Flex>
    )
  }

  const RenderItemEdit = ({ row: { original } }: Cell<ItemsData>) => {
    return (
      <Flex justifyContent="center" flexDirection="column" alignItems="flex-start">
        <Button
          title="Edit"
          onClick={() => {
            setItemUpdate(original)
            setModalTitle('Edit Item')
            setShowModalItems(true)
          }}
          isDisabled={Enum_Quote_Status.Sent === quote?.status ? true : false}
        >
          <Edit2 size={20} color="black" />
        </Button>
      </Flex>
    )
  }

  const itemColumns = [
    {
      Header: 'Item',
      accessor: 'item',
      Cell: RenderItem
    },
    {
      Header: 'Description',
      accessor: 'description',
      Cell: RenderDescription
    },
    {
      Header: 'Quantity',
      accessor: 'delete',
      Cell: RenderQuantity
    },
    {
      Header: 'Unit Price',
      accessor: 'delete',
      Cell: RenderUnitPrice
    },
    {
      Header: 'Total Price',
      accessor: 'delete',
      Cell: RenderTotalPrice
    },
    {
      Header: 'Item Type ',
      accessor: 'itemType',
      Cell: RenderItemType
    },
    {
      Header: 'Delete',
      accessor: 'delete',
      Cell: RenderItemDelete
    },
    {
      Header: 'Edit',
      accessor: 'delete',
      Cell: RenderItemEdit
    }
  ]

  const handleUpdateClick = async (termsAndConditions?: string) => {
    const updatedItems: Items[] = []
    itemData.map((item) => {
      return updatedItems.push({
        id: item.id,
        item: item.item.id,
        description: item.description,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        totalPrice: item.totalPrice
      })
    })

    await updateQuote({
      variables: {
        id: idQuote,
        input: {
          termsAndConditions,
          documents,
          items: updatedItems,
          status: Enum_Quote_Status.Draft
        }
      }
    })

    return toast({
      description: `Quote ${idQuote} updated successfully`
    })
  }

  const handleCloseClick = async () => {
    await deleteQuote({
      variables: {
        id: idQuote
      }
    })

    history.push(`/tickets/${idTicket}`)
    return toast({
      description: `Quote ${idQuote} deleted successfully`
    })
  }

  const renderItemsTileView = (itemObj: any) => {
    return (
      <Flex key={itemObj?.id} onClick={() => null} m={1} width={['100%', '48%', '48%', '24%']}>
        <Card width="100%">
          <Flex flexDirection="row" justifyContent="space-between" m={2}>
            <Flex flexDirection="column">
              <Text color={colors.solid.lightGray}>Name</Text>
              <Text>{itemObj?.item?.name}</Text>
            </Flex>
            <Flex flexDirection="row">
              <Button
                mr={2}
                title="Delete"
                onClick={() =>
                  setItemData((prevData) => prevData.filter((x) => x.id !== itemObj?.id))
                }
                isDisabled={Enum_Quote_Status.Sent === quote?.status ? true : false}
              >
                <Trash2 size={20} color="black" />
              </Button>
              <Button
                title="Edit"
                onClick={() => {
                  setItemUpdate(itemObj)
                  setModalTitle('Edit Item')
                  setShowModalItems(true)
                }}
                isDisabled={Enum_Quote_Status.Sent === quote?.status ? true : false}
              >
                <Edit2 size={20} color="black" />
              </Button>
            </Flex>
          </Flex>
          <Flex flexDirection="row" m={2} justifyContent="space-between">
            <Flex flexDirection="column">
              <Text color={colors.solid.lightGray}>Description</Text>
              <Text>{itemObj?.description}</Text>
            </Flex>
            <Flex flexDirection="column">
              <Text color={colors.solid.lightGray}>Quantity</Text>
              <Text>{itemObj?.quantity}</Text>
            </Flex>
          </Flex>
          <Flex flexDirection="row" m={2} justifyContent="space-between">
            <Flex flexDirection="column">
              <Text color={colors.solid.lightGray}>Unit Price</Text>
              <Text>R {(Math.round(itemObj?.unitPrice * 100) / 100).toFixed(2)}</Text>
            </Flex>
            <Flex flexDirection="column">
              <Text color={colors.solid.lightGray}>Total Price</Text>
              <Text> R {(Math.round(itemObj?.totalPrice * 100) / 100).toFixed(2)}</Text>
            </Flex>
          </Flex>
          <Flex flexDirection="column" m={2}>
            <Text color={colors.solid.lightGray}>Item Type</Text>
            <Text>{itemObj?.itemType?.name}</Text>
          </Flex>
        </Card>
      </Flex>
    )
  }

  const renderDocsTileView = (document: any) => {
    return (
      <Flex
        key={document?.id}
        onClick={() => alert(document?.id)}
        m={1}
        width={['100%', '48%', '48%', '24%']}
      >
        <Card width="100%">
          <Flex flexDirection="row" justifyContent="space-between" m={2}>
            <Flex flexDirection="column" mr={3} overflow="overlay">
              <Text color={colors.solid.lightGray}>Name</Text>
              <Text>{document?.name}</Text>
            </Flex>
            <Button
              title="Delete"
              onClick={() => DeleteRow(document.id)}
              isDisabled={Enum_Quote_Status.Sent === quote?.status ? true : false}
            >
              <Trash2 size={20} color="black" />
            </Button>
          </Flex>
          <Flex flexDirection="column" m={2}>
            <Text color={colors.solid.lightGray}>Expiry Date</Text>
            <Text>{moment(document?.created_at).format('YYYY-MM-DD')}</Text>
          </Flex>
        </Card>
      </Flex>
    )
  }

  type LoginFormValues = typeof INITIAL_VALUES
  type ItemsFormValues = typeof INITIAL_VALUES_ITEMS

  const renderTotalTable = () => {
    let totalAmount = 0
    itemData.map((item) => {
      return (totalAmount += item.totalPrice)
    })

    return (
      <Flex m={3} alignItems="center" justifyContent="space-between">
        <Text>Total</Text>
        <Text fontWeight="bold">R {totalAmount.toFixed(2)}</Text>
      </Flex>
    )
  }

  const documentsTableData = () => {
    const updatedItems: any[] = []
    documentData.map((doc) => {
      if (!deletedDocumentData.includes(doc.id)) {
        updatedItems.push(doc)
      }

      return updatedItems
    })

    return updatedItems
  }

  const itemOptions = async (
    item: any,
    unitPrice: number,
    quantity: number,
    description: string,
    itemType: any
  ) => {
    const itemUpdateIndex = itemData.findIndex((x) => x.id === itemUpdate?.id)
    const updatedItem = {
      item: item.value,
      description,
      unitPrice: unitPrice * 1,
      quantity: quantity * 1,
      totalPrice: quantity * unitPrice,
      itemType: itemType.value
    }

    switch (modalTitle) {
      case 'Add Item':
        itemData.push(updatedItem)
        setItemData(itemData)
        const updatedItemsAdd = itemData.map((item) => ({
          item: item.item?.id,
          description: item.description,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          totalPrice: item.totalPrice,
          itemType: item.itemType?.id
        }))

        await updateQuote({
          variables: {
            id: idQuote,
            input: {
              items: updatedItemsAdd,
              status: Enum_Quote_Status.Draft
            }
          }
        })
        refetch()
        break
      case 'Edit Item':
        itemData[itemUpdateIndex] = updatedItem
        setItemData(itemData)
        const updatedItems = itemData.map((item) => ({
          item: item.item?.id,
          description: item.description,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          totalPrice: item.totalPrice,
          itemType: item.itemType?.id
        }))

        await updateQuote({
          variables: {
            id: idQuote,
            input: {
              items: updatedItems,
              status: Enum_Quote_Status.Draft
            }
          }
        })
        refetch()
        break
      default:
        break
    }
  }

  return (
    <PageWrap>
      <Container fluid={true}>
        <Formik
          initialValues={INITIAL_VALUES}
          validationSchema={QuoteFormValidation}
          onSubmit={async ({ termsAndConditions, documents }, { setStatus, setSubmitting }) => {
            try {
              setSubmitting(true)
              const updatedItems: Items[] = []
              itemData.map((item) => {
                return updatedItems.push({
                  id: item.id,
                  item: item.item.id,
                  description: item.description,
                  quantity: item.quantity,
                  unitPrice: item.unitPrice,
                  totalPrice: item.totalPrice
                })
              })

              await updateQuote({
                variables: {
                  id: idQuote,
                  input: {
                    status: Enum_Quote_Status.Sent,
                    termsAndConditions,
                    documents: documents,
                    items: updatedItems
                  }
                }
              })

              refetch()
              toast({
                description: `Quote ${idQuote} updated its status to ${Enum_Quote_Status.Sent}`
              })

              setSubmitting(false)
            } catch (err) {
              setStatus(err.message)
              setSubmitting(false)
            }
          }}
          render={({
            handleSubmit,
            isSubmitting,
            setFieldValue,
            values
          }: FormikProps<LoginFormValues>) => {
            return (
              quote && (
                <Form>
                  <Flex justifyContent="space-between" flexDirection={['column', 'row']}>
                    <Text>
                      Quote - {idQuote} - {quote?.status}
                    </Text>
                    <Flex flexDirection="row" mt={[3, 0]}>
                      <Button
                        size="sm"
                        ml={[0, 2]}
                        title="Delete"
                        isDisabled={Enum_Quote_Status.Sent === quote?.status ? true : false}
                        onClick={() => setShowCloseModal(true)}
                      >
                        Delete
                      </Button>
                      <Button
                        size="sm"
                        ml={2}
                        bg={colors.brand[500]}
                        color={colors.solid.white}
                        title="Save"
                        isDisabled={Enum_Quote_Status.Sent === quote?.status ? true : false}
                        onClick={() => handleUpdateClick(values?.termsAndConditions || '')}
                      >
                        Save
                      </Button>
                      <Button
                        size="sm"
                        ml={2}
                        isFullWidth
                        variantColor="brand"
                        isLoading={isSubmitting}
                        type="submit"
                        isDisabled={Enum_Quote_Status.Sent === quote?.status ? true : false}
                        onClick={() => handleSubmit()}
                      >
                        Send Quotation
                      </Button>
                    </Flex>

                    <ModalWrap
                      isCentered={true}
                      onClose={() => setShowCloseModal(false)}
                      isOpen={showCloseModal}
                      title="Delete Quote"
                    >
                      <Text p={5}>
                        Are you sure you want to delete this quote? By deleting this you will lose
                        any unsaved changes.
                      </Text>
                      <Box justifyContent="right">
                        <Button
                          width={150}
                          mr={4}
                          mt={5}
                          mb={5}
                          float="right"
                          variantColor="brand"
                          type="submit"
                          onClick={() => handleCloseClick()}
                        >
                          Delete Quote
                        </Button>
                      </Box>
                    </ModalWrap>
                  </Flex>
                  <Flex justify={['center', 'start']} align="center" mt={[3, 0]} mb={5}>
                    <FormLabel width={100} htmlFor="table-view">
                      Table View
                    </FormLabel>
                    <Switch
                      id="table-view"
                      size="md"
                      children="children"
                      onChange={() => setTableView(!tableView)}
                      value={tableView}
                    />
                  </Flex>

                  <Card p={5}>
                    <Flex justifyContent="space-between" mt={[0, 10]}>
                      <Flex flexDirection={['column', 'row']} textAlign="left">
                        <Flex flexDirection="column">
                          <Text color={colors.solid.lightGray}>Vendor</Text>
                          <Text>{quote.contractor?.client?.name}</Text>
                        </Flex>
                        <Flex flexDirection="column" textAlign="left" mt={[5, 0]} ml={[0, 5]}>
                          <Text color={colors.solid.lightGray}>Quote</Text>
                          <Text>{idQuote}</Text>
                        </Flex>
                        <Flex flexDirection="column" textAlign="left" mt={[5, 0]} ml={[0, 5]}>
                          <Text color={colors.solid.lightGray}>VAT</Text>
                          <Text>{quote?.contractor?.client?.vatNumber}</Text>
                        </Flex>
                      </Flex>
                      <Flex flexDirection={['column', 'row']}>
                        <Flex flexDirection="column" textAlign="left" mr={5}>
                          <Text color={colors.solid.lightGray}>Date Sent</Text>
                          <Text>{currentDate}</Text>
                        </Flex>
                        <Flex flexDirection="column" textAlign="left" mt={[5, 0]}>
                          <Text color={colors.solid.lightGray}>Expiry Date</Text>
                          <Text>{expiryDate}</Text>
                        </Flex>
                      </Flex>
                    </Flex>
                    <Flex width={['100%', '50%']}>
                      <Field
                        mt={5}
                        name="termsAndConditions"
                        label="Terms And Conditions"
                        component={ConnectedTextArea}
                        isDisabled={Enum_Quote_Status.Sent === quote?.status ? true : false}
                      />
                    </Flex>
                  </Card>
                  <Flex>
                    <Box width="100%">
                      <Card mt={5}>
                        <Text pl={5} pt={5} mb={5} fontWeight="bold">
                          Items
                        </Text>
                        <Flex pl={[2, 10]} pr={[2, 10]} flexDirection="row" flexWrap="wrap">
                          {itemData && itemData.length > 0 ? (
                            tableView ? (
                              <Table
                                columns={itemColumns}
                                onRowClick={() => null}
                                data={itemData || []}
                              />
                            ) : (
                              itemData.map((item) => {
                                return renderItemsTileView(item)
                              })
                            )
                          ) : (
                            <Flex justifyContent="center">
                              <Text>Add items to quote</Text>
                            </Flex>
                          )}
                        </Flex>
                        {renderTotalTable()}
                        <Box justifyContent="right" mr={[3, 0]} ml={[3, 0]}>
                          <Button
                            size="sm"
                            width={['100%', 150]}
                            mr={4}
                            mt={10}
                            mb={5}
                            bg="#717273"
                            float={['unset', 'right']}
                            color={colors.solid.white}
                            title="Upload Files"
                            isDisabled={Enum_Quote_Status.Sent === quote?.status ? true : false}
                            onClick={() => {
                              setShowModalItems(true)
                              setModalTitle('Add Item')
                            }}
                          >
                            Add Item
                          </Button>
                        </Box>
                      </Card>
                    </Box>
                  </Flex>
                  <Flex>
                    <Box width="100%">
                      <Card mt={5}>
                        <Text pl={5} pt={5} mb={5} fontWeight="bold">
                          Quote Uploads
                        </Text>
                        <Box pl={[4, 10]} pr={[4, 10]} flexDirection="row" flexWrap="wrap">
                          <Field
                            name="documents"
                            columns={Columns}
                            data={documentsTableData()}
                            component={ConnectedTable}
                            checker={tableView}
                            tileView={(e: any) => renderDocsTileView(e)}
                            isDisabled={Enum_Quote_Status.Sent === quote?.status ? true : false}
                          />
                        </Box>
                        <Box justifyContent="right" mr={[3, 0]} ml={[3, 0]}>
                          <Button
                            size="sm"
                            width={['100%', 150]}
                            mr={4}
                            mt={10}
                            mb={5}
                            bg="#717273"
                            float={['unset', 'right']}
                            color={colors.solid.white}
                            title="Upload Files"
                            isDisabled={Enum_Quote_Status.Sent === quote?.status ? true : false}
                            onClick={() => setShowModal(true)}
                          >
                            Upload Files
                          </Button>
                        </Box>
                      </Card>
                    </Box>
                  </Flex>

                  <ModalWrap
                    isCentered={true}
                    onClose={() => setShowModal(false)}
                    isOpen={showModal}
                    title="Upload Files"
                  >
                    <Dashboard uppy={uppy(setFieldValue)} />
                  </ModalWrap>
                  <ModalWrap
                    isCentered={true}
                    onClose={() => setShowModalItems(false)}
                    isOpen={showModalItems}
                    title={modalTitle}
                  >
                    <Formik
                      initialValues={INITIAL_VALUES_ITEMS}
                      validationSchema={ItemsFormValidation}
                      onSubmit={async (
                        { item, description, unitPrice, quantity, itemType },
                        { setStatus, setSubmitting }
                      ) => {
                        try {
                          setSubmitting(true)
                          itemOptions(item, unitPrice, quantity, description, itemType)
                          setShowModalItems(false)
                          setSubmitting(false)
                        } catch (err) {
                          setStatus(err.message)
                          setSubmitting(false)
                        }
                      }}
                      render={({
                        handleSubmit,
                        isSubmitting,
                        setFieldValue
                      }: FormikProps<ItemsFormValues>) => {
                        return (
                          <Form>
                            <Flex m={5} flexDirection="column">
                              <Field
                                name="item"
                                accessor="items"
                                queryDocument={GetItemsDocument}
                                label="Select Item"
                                component={ConnectedAsyncSelect}
                                onSelect={(value: any) => {
                                  setFieldValue('description', value.description)
                                  setFieldValue(
                                    'unitPrice',
                                    (Math.round(value.recommendedUnitPrice * 100) / 100).toFixed(2)
                                  )
                                }}
                              />
                              <Field
                                name="description"
                                label="Description"
                                component={ConnectedFormGroup}
                              />
                              <Field
                                name="unitPrice"
                                label="Unit Price"
                                component={ConnectedFormGroup}
                              />
                              <Field
                                name="quantity"
                                label="Quantity"
                                component={ConnectedFormGroup}
                              />
                              <Field
                                name="itemType"
                                accessor="itemTypes"
                                queryDocument={GetItemTypesDocument}
                                label="Select Item"
                                component={ConnectedAsyncSelect}
                              />
                              <Button
                                ml={2}
                                isFullWidth
                                variantColor="brand"
                                isLoading={isSubmitting}
                                type="submit"
                                onClick={() => handleSubmit()}
                              >
                                Done
                              </Button>
                            </Flex>
                          </Form>
                        )
                      }}
                    />
                  </ModalWrap>
                </Form>
              )
            )
          }}
        />
      </Container>
    </PageWrap>
  )
}

export default QuoteDetail
