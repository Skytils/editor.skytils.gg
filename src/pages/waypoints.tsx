import type { AccordionControlProps } from '@mantine/core';
import {
  Accordion,
  ActionIcon,
  Box,
  Button,
  Checkbox,
  ColorInput,
  Flex,
  Group,
  Loader,
  Menu,
  Modal,
  NumberInput,
  Pagination,
  Paper,
  Select,
  SimpleGrid,
  Stack,
  Text,
  Textarea,
  TextInput,
  Title,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { useClipboard } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import { createStyles } from '@mantine/styles';
import { IconCopy, IconDots, IconTrash } from '@tabler/icons-react';
import axios from 'axios';
import { getCookie } from 'cookies-next';
import { useEffect, useState } from 'react';
import { gunzip, gzip } from 'zlib';

import {
  convertWaypointOptionsToDecimal,
  convertWaypointOptionsToHex,
} from '@/lib/functions';
import type {
  HostOptions,
  SkyblockIslandData,
  WaypointCategory,
  WaypointOptions,
} from '@/types';

enum SUCCESS_API_MESSAGES {
  GET = 'Successfully retrieved waypoints.',
  POST = 'Successfully updated your waypoints',
  PUT = 'Successfully updated your waypoints',
}

const useStyles = createStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    minHeight: '85vh',
    height: 'fit-content',
  },
  container: {
    position: 'relative',
    minHeight: '50vh',
    height: 'fit-content',
  },
  loader: {
    position: 'absolute',
    top: '40%',
  },
  waypointSettingsAccordion: {
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  noWaypointsFound: {
    color: theme.colors.gray[5],
  },
  buttons: {
    width: 'fit-content%',
    marginTop: theme.spacing.md,
  },
}));

export default function Home() {
  const { classes } = useStyles();
  const clipboard = useClipboard({ timeout: 500 });

  const [loading, setLoading] = useState<boolean>(false);
  const [waypoints, setWaypoints] = useState<WaypointCategory[]>([]);
  const [islands, setIslands] = useState<SkyblockIslandData[]>([]);
  const [selectedIsland, setSelectedIsland] = useState<string>('all');
  const [selectedAccordion, setSelectedAccordion] = useState<string | null>(
    null,
  );
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [createNewCategoryModal, setCreateNewCategoryModal] =
    useState<boolean>(false);
  const [importCategoryModal, setImportCategoryModal] =
    useState<boolean>(false);
  const [exportCategoryModal, setExportCategoryModal] =
    useState<boolean>(false);

  const form = useForm<{ categories: WaypointCategory[] }>({
    initialValues: {
      categories: [],
    },
  });
  const createCategoryForm = useForm<{ data: WaypointCategory }>({
    initialValues: {
      data: {
        name: '',
        waypoints: [],
        island: '',
      },
    },
  });
  const importCategoryForm = useForm<{ data: string }>({
    initialValues: {
      data: '',
    },
  });
  const exportCategoryForm = useForm<{
    selectedCategory: string;
    selected: string[];
  }>({
    initialValues: {
      selectedCategory: '',
      selected: [],
    },
  });

  useEffect(() => {
    makeRequest('GET');
  }, []);

  const makeRequest = (
    method: 'GET' | 'POST' | 'PUT',
    body?: Record<any, any>,
  ) => {
    setLoading(true);
    const cookie = getCookie('HostOptions');
    if (!cookie) {
      return notifications.show({
        title: 'Error',
        message: (
          <Text>
            You must enter a host in the <a href={'/settings'}>settings</a> page
            before continuing.
          </Text>
        ),
        autoClose: 7500,
      });
    }
    const hostOptions: HostOptions = JSON.parse(cookie as string);
    if (!hostOptions.password) {
      return notifications.show({
        title: 'Error',
        message: (
          <Text>
            You must enter a password in the <a href={'/settings'}>settings</a>{' '}
            page before continuing.
          </Text>
        ),
        autoClose: 7500,
      });
    }
    return axios
      .all([
        axios.request({
          method,
          headers: {
            Authorization: `Basic ${Buffer.from(
              `skytilseditor:${hostOptions.password}`,
            ).toString('base64')}`,
          },
          url: `http://${hostOptions.host}:${hostOptions.port}/api/skytils/waypoints`,
          data: body,
        }),
        axios.get(
          `http://${hostOptions.host}:${hostOptions.port}/api/skytils/data/islands`,
          {
            headers: {
              Authorization: `Basic ${Buffer.from(
                `skytilseditor:${hostOptions.password}`,
              ).toString('base64')}`,
            },
          },
        ),
      ])
      .then(async (res) => {
        const categories = convertWaypointOptionsToHex(
          res[0].data.categories,
        ).map((category: WaypointCategory) => {
          return {
            ...category,
            waypoints: category.waypoints.sort(
              (a: WaypointOptions, b: WaypointOptions) => {
                return a.name.localeCompare(b.name, 'en', {
                  numeric: true,
                });
              },
            ),
          };
        });
        setWaypoints(categories);
        setIslands(res[1].data);
        form.setValues({ categories });
        setLoading(false);
        notifications.show({
          title: 'Success',
          message: SUCCESS_API_MESSAGES[method],
          autoClose: 10000,
          color: 'green',
        });
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
        notifications.show({
          title: 'Error',
          message: err.response?.data?.error || 'An unknown error occurred.',
          autoClose: 10000,
          color: 'red',
        });
      });
  };

  const handleResetValues = () => {
    try {
      form.setValues({ categories: waypoints });
      notifications.show({
        title: 'Success',
        message: 'Successfully reset your values.',
        autoClose: 10000,
        color: 'green',
      });
    } catch (e) {
      console.error(e);
      notifications.show({
        title: 'Error',
        message: 'An unknown error occurred.',
        autoClose: 10000,
        color: 'red',
      });
    }
  };

  const handleSubmit = (values: WaypointCategory[]) => {
    const cookie = getCookie('HostOptions');
    if (!cookie) {
      return notifications.show({
        title: 'Error',
        message: (
          <Text>
            You must enter a host in the <a href={'/settings'}>settings</a> page
            before continuing.
          </Text>
        ),
        autoClose: 7500,
      });
    }
    const hostOptions: HostOptions = JSON.parse(cookie as string);
    if (!hostOptions.password) {
      return notifications.show({
        title: 'Error',
        message: (
          <Text>
            You must enter a password in the <a href={'/settings'}>settings</a>{' '}
            page before continuing.
          </Text>
        ),
        autoClose: 7500,
      });
    }
    axios
      .post(
        `http://${hostOptions.host}:${hostOptions.port}/api/skytils/waypoints`,
        {
          categories: convertWaypointOptionsToDecimal(Object.values(values)),
        },
        {
          headers: {
            Authorization: `Basic ${Buffer.from(
              `skytilseditor:${hostOptions.password}`,
            ).toString('base64')}`,
          },
        },
      )
      .then((res) => {
        notifications.show({
          title: 'Success',
          message: 'Successfully saved your waypoints.',
          autoClose: 10000,
          color: 'green',
        });
      })
      .catch((err) => {
        console.error(err);
        notifications.show({
          title: 'Error',
          message: err.response?.data?.error || 'An unknown error occurred.',
          autoClose: 10000,
          color: 'red',
        });
      });
  };

  const OuterAccordionControl = (
    props: AccordionControlProps & {
      category: WaypointCategory;
      categoryIndex: number;
    },
  ) => {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Accordion.Control {...props} />
        <Menu>
          <Menu.Target>
            <ActionIcon size="lg">
              <IconDots size="1rem" />
            </ActionIcon>
          </Menu.Target>
          <Menu.Dropdown>
            <Menu.Label>Category Settings</Menu.Label>
            <Menu.Item
              onClick={() => {
                form.insertListItem(
                  `categories.${props.categoryIndex}.waypoints`,
                  {
                    name: '',
                    color: '#ff0000',
                    enabled: true,
                    x: 0,
                    y: 0,
                    z: 0,
                  },
                );
                handleSwitchAccordion(
                  `${props.category.name}-${props.categoryIndex}`,
                );
                console.log(currentPage);
              }}
            >
              Add Waypoint
            </Menu.Item>
            <Menu.Item
              onClick={() =>
                form.setValues(({ categories }) => {
                  let category = (categories as WaypointCategory[])[
                    props.categoryIndex
                  ];
                  category.waypoints.forEach((waypoint) => {
                    waypoint.enabled = true;
                  });
                  return { categories };
                })
              }
            >
              Enable All Waypoints
            </Menu.Item>
            <Menu.Item
              onClick={() =>
                form.setValues(({ categories }) => {
                  let category = (categories as WaypointCategory[])[
                    props.categoryIndex
                  ];
                  category.waypoints.forEach((waypoint) => {
                    waypoint.enabled = false;
                  });
                  return { categories };
                })
              }
            >
              Disable All Waypoints
            </Menu.Item>
            <Menu.Item
              color={'red'}
              icon={<IconTrash size="1rem" />}
              onClick={() =>
                form.removeListItem(`categories`, props.categoryIndex)
              }
            >
              Delete Category
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </Box>
    );
  };

  const InnerAccordionControl = (
    props: AccordionControlProps & {
      categoryIndex: number;
      waypointIndex: number;
      waypoint: WaypointOptions;
    },
  ) => {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Accordion.Control {...props} />
        <Menu>
          <Menu.Target>
            <ActionIcon size="lg">
              <IconDots size="1rem" />
            </ActionIcon>
          </Menu.Target>
          <Menu.Dropdown>
            <Menu.Label>Waypoint Settings</Menu.Label>
            <Menu.Item
              icon={<IconCopy size="1rem" />}
              onClick={() => {
                form.insertListItem(
                  `categories.${props.categoryIndex}.waypoints`,
                  props.waypoint,
                  props.waypointIndex + 1,
                );
              }}
            >
              Duplicate Waypoint
            </Menu.Item>
            <Menu.Item
              color={'red'}
              icon={<IconTrash size="1rem" />}
              onClick={() => {
                form.removeListItem(
                  `categories.${props.categoryIndex}.waypoints`,
                  props.waypointIndex,
                );
              }}
            >
              Delete Waypoint
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </Box>
    );
  };
  const handleSwitchAccordion = (value: string | null) => {
    setSelectedAccordion(value);
    setCurrentPage(1);
  };

  const handleCreateModal = (value: WaypointCategory) => {
    form.insertListItem(`categories`, {
      ...value,
      waypoints: [
        { name: '', color: '#ff0000', enabled: true, x: 0, y: 0, z: 0 },
      ],
    });
    setCreateNewCategoryModal(false);
    createCategoryForm.reset();
  };

  const handleImportModal = (value: string) => {
    if (value.startsWith(`<Skytils-Waypoint-Data>(V`)) {
      const version = parseInt(
        value.split(`<Skytils-Waypoint-Data>(V`)[1].split(')')[0],
      );
      const content = value.split(`:`)[1];
      if (version !== 1) throw new Error(`Invalid version: ${version}!`);
      gunzip(Buffer.from(content, 'base64'), (err, uncompressed) => {
        if (err) throw err;
        const category = convertWaypointOptionsToHex(
          JSON.parse(uncompressed.toString()).categories,
        ).map((category: WaypointCategory) => {
          return {
            ...category,
            waypoints: category.waypoints.sort(
              (a: WaypointOptions, b: WaypointOptions) => {
                return a.name.localeCompare(b.name, 'en', {
                  numeric: true,
                });
              },
            ),
          };
        });
        category.forEach((category: WaypointCategory) => {
          form.insertListItem(`categories`, category);
        });
      });
    }
    importCategoryForm.reset();
    setImportCategoryModal(false);
  };

  const handleExport = ({
    selectedCategory,
    selected,
  }: {
    selectedCategory: string;
    selected: string[];
  }) => {
    const category: WaypointCategory = {
      name: form.values.categories[parseInt(selectedCategory.split('-')[1])]
        .name,
      waypoints: form.values.categories[
        parseInt(selectedCategory.split('-')[1])
      ]?.waypoints.filter((waypoint: WaypointOptions, index) =>
        selected.includes(`${waypoint.name || ''}-${index}`),
      ),
      island:
        form.values.categories[parseInt(selectedCategory.split('-')[1])].island,
    };
    const compressed = JSON.stringify({
      categories: convertWaypointOptionsToDecimal([category]),
    });
    gzip(compressed, (err, compressed) => {
      if (err)
        return notifications.show({
          title: 'Error',
          message: 'An error occurred while exporting your waypoints.',
          color: 'red',
          autoClose: 10000,
        });
      clipboard.copy(
        `<Skytils-Waypoint-Data>(V1):${compressed.toString('base64')}`,
      );
      setExportCategoryModal(false);
      exportCategoryForm.reset();
      notifications.show({
        title: 'Success',
        message: 'Your waypoints have been exported to your clipboard.',
        color: 'green',
        autoClose: 10000,
      });
    });
  };

  return (
    <div className={classes.root}>
      {loading ? (
        <div className={classes.loader}>
          <Stack align={'center'} justify={'flex-start'}>
            <Loader size={'lg'} variant={'bars'} />
            <Text>Loading Your Data...</Text>
          </Stack>
        </div>
      ) : (
        <>
          <Modal
            opened={createNewCategoryModal}
            onClose={() => {
              setCreateNewCategoryModal(false);
              createCategoryForm.reset();
            }}
            title={'Create New Category'}
            size={'md'}
          >
            <form
              onSubmit={createCategoryForm.onSubmit((e) =>
                handleCreateModal(e.data),
              )}
            >
              <Stack spacing={4} justify={'space-between'}>
                <TextInput
                  required={true}
                  withAsterisk={true}
                  label={'Category Name'}
                  placeholder={'Enter a name for your category'}
                  {...createCategoryForm.getInputProps('data.name')}
                />
                <Select
                  required={true}
                  withAsterisk={true}
                  label={'Island'}
                  data={islands.map((i) => {
                    return {
                      value: i.mode,
                      label: i.displayName,
                    };
                  })}
                  dropdownPosition="bottom"
                  searchable
                  withinPortal={true}
                  placeholder={'Select an island'}
                  allowDeselect={true}
                  {...createCategoryForm.getInputProps('data.island')}
                />
                <Group position={'apart'} mt={'md'}>
                  <Button
                    onClick={() => {
                      setCreateNewCategoryModal(false);
                      createCategoryForm.reset();
                    }}
                  >
                    Cancel
                  </Button>
                  <Group>
                    <Button
                      variant={'outline'}
                      onClick={() => createCategoryForm.reset()}
                    >
                      Reset
                    </Button>
                    <Button type={'submit'}>Create</Button>
                  </Group>
                </Group>
              </Stack>
            </form>
          </Modal>
          <Modal
            opened={importCategoryModal}
            onClose={() => {
              setImportCategoryModal(false);
            }}
            title={'Import Category'}
          >
            <form
              onSubmit={importCategoryForm.onSubmit((e) =>
                handleImportModal(e.data),
              )}
            >
              <Textarea
                label={'Category GZIP'}
                minRows={5}
                placeholder={'Paste your category gzip here'}
                required={true}
                withAsterisk={true}
                {...importCategoryForm.getInputProps('data')}
              />
              <Group position={'apart'} mt={'md'}>
                <Button
                  onClick={() => {
                    setImportCategoryModal(false);
                    importCategoryForm.reset();
                  }}
                >
                  Cancel
                </Button>
                <Group>
                  <Button
                    variant={'outline'}
                    onClick={() => importCategoryForm.reset()}
                  >
                    Reset
                  </Button>
                  <Button type={'submit'}>Save</Button>
                </Group>
              </Group>
            </form>
          </Modal>
          <Modal
            opened={exportCategoryModal}
            onClose={() => {
              setExportCategoryModal(false);
              exportCategoryForm.reset();
            }}
            title={'Export Category'}
          >
            <form
              onSubmit={exportCategoryForm.onSubmit((e) => handleExport(e))}
            >
              <Select
                data={form.values.categories.map(
                  (category: WaypointCategory, _) => {
                    return {
                      value: `${category.name}-${_}`,
                      label: category.name || 'Unnamed Category',
                    };
                  },
                )}
                withinPortal={true}
                label={'Category'}
                placeholder={'Select a category to export'}
                required={true}
                withAsterisk={true}
                searchable={true}
                {...exportCategoryForm.getInputProps('selectedCategory')}
              />
              <Checkbox.Group
                label={'Waypoints'}
                value={exportCategoryForm.values.selected}
                onChange={(value) => {
                  exportCategoryForm.setValues((prev) => {
                    return {
                      ...prev,
                      selected: value,
                    };
                  });
                }}
              >
                <SimpleGrid cols={2} spacing={2}>
                  <Button
                    variant={'outline'}
                    style={{
                      width: '75%',
                      marginLeft: 'auto',
                      marginRight: 'auto',
                    }}
                    onClick={() => {
                      exportCategoryForm.setValues((prev) => {
                        return {
                          ...prev,
                          selected: form.values.categories
                            .find(
                              (category: WaypointCategory, _) =>
                                `${category.name}-${_}` ===
                                exportCategoryForm.values.selectedCategory,
                            )
                            ?.waypoints.map(
                              (data: WaypointOptions, _) =>
                                `${data.name || ''}-${_}`,
                            ),
                        };
                      });
                    }}
                  >
                    Select All
                  </Button>
                  <Button
                    variant={'outline'}
                    style={{
                      width: '75%',
                      marginLeft: 'auto',
                      marginRight: 'auto',
                    }}
                    onClick={() => {
                      exportCategoryForm.setValues((prev) => {
                        return {
                          ...prev,
                          selected: [],
                        };
                      });
                    }}
                  >
                    Deselect All
                  </Button>
                  {form.values.categories
                    .find(
                      (category: WaypointCategory, _) =>
                        `${category.name}-${_}` ===
                        exportCategoryForm.values.selectedCategory,
                    )
                    ?.waypoints.map((data: WaypointOptions, _) => {
                      return (
                        <Checkbox
                          key={`${_}`}
                          value={`${data.name}-${_}`}
                          label={data.name || 'Unnamed Waypoint'}
                        />
                      );
                    })}
                </SimpleGrid>
              </Checkbox.Group>
              <Group position={'apart'} mt={'md'}>
                <Button
                  onClick={() => {
                    setImportCategoryModal(false);
                    exportCategoryForm.reset();
                  }}
                >
                  Cancel
                </Button>
                <Group>
                  <Button
                    variant={'outline'}
                    onClick={() => exportCategoryForm.reset()}
                  >
                    Reset
                  </Button>
                  <Button type={'submit'}>Export</Button>
                </Group>
              </Group>
            </form>
          </Modal>
          <Title align={'center'} py={25}>
            Skytils Waypoint Editor
          </Title>
          <Paper
            shadow="md"
            p="md"
            withBorder={true}
            w={'50%'}
            mih={'50%'}
            className={classes.container}
          >
            <Group position={'apart'}>
              <Group>
                <Button
                  variant={'outline'}
                  onClick={() => setImportCategoryModal(true)}
                >
                  Import
                </Button>
                <Button
                  variant={'outline'}
                  onClick={() => setExportCategoryModal(true)}
                >
                  Export
                </Button>
              </Group>
              <Select
                data={[{ value: 'all', label: 'All' }].concat(
                  islands.map((i) => {
                    return {
                      value: i.mode,
                      label: i.displayName,
                    };
                  }),
                )}
                value={selectedIsland}
                onChange={(e) => setSelectedIsland(e as string)}
                searchable={true}
                label={'Filter By Island'}
              />
            </Group>
            <Flex justify={'flex-end'} mb={'0.5rem'}></Flex>
            <form onSubmit={form.onSubmit((e) => handleSubmit(e.categories))}>
              <Accordion
                chevronPosition="left"
                value={selectedAccordion}
                onChange={handleSwitchAccordion}
              >
                {(selectedIsland == 'all'
                  ? Object.entries(form.values.categories)
                  : Object.entries(form.values.categories).filter(
                      ([_, category]) => category.island == selectedIsland,
                    )
                ).map(([categoryKey, category], categoryIndex) => {
                  categoryIndex = Object.entries(
                    form.values.categories,
                  ).findIndex(([_, sub]) => sub == category);
                  return (
                    <Accordion.Item
                      key={categoryIndex}
                      value={`${category.name}-${categoryIndex}`}
                    >
                      <OuterAccordionControl
                        category={category}
                        categoryIndex={categoryIndex}
                      >
                        {category.name || 'No Name Assigned'}
                      </OuterAccordionControl>
                      <Accordion.Panel>
                        {selectedAccordion ===
                          `${category.name}-${categoryIndex}` &&
                          (category.waypoints.length == 0 ? (
                            <Text
                              align={'center'}
                              className={classes.noWaypointsFound}
                            >
                              No waypoints found for this category.
                            </Text>
                          ) : (
                            <Accordion>
                              {category.waypoints
                                .slice((currentPage - 1) * 10, currentPage * 10)
                                .map((waypoint, waypointIndex) => (
                                  <Accordion.Item
                                    key={waypointIndex}
                                    value={waypointIndex.toString()}
                                  >
                                    <InnerAccordionControl
                                      categoryIndex={categoryIndex}
                                      waypointIndex={
                                        waypointIndex + (currentPage - 1) * 10
                                      }
                                      waypoint={waypoint}
                                    >
                                      {waypoint.name || 'No Name Assigned'}
                                    </InnerAccordionControl>
                                    <Accordion.Panel>
                                      <SimpleGrid
                                        cols={3}
                                        className={
                                          classes.waypointSettingsAccordion
                                        }
                                        breakpoints={[
                                          {
                                            minWidth: 'sm',
                                            cols: 1,
                                          },
                                          {
                                            minWidth: 'md',
                                            cols: 2,
                                          },
                                          {
                                            minWidth: 1200,
                                            cols: 3,
                                          },
                                        ]}
                                      >
                                        <TextInput
                                          label={'Name'}
                                          {...form?.getInputProps(
                                            `categories.${categoryIndex}.waypoints.${
                                              waypointIndex +
                                              (currentPage - 1) * 10
                                            }.name`,
                                          )}
                                        />
                                        <ColorInput
                                          label={'Color'}
                                          withEyeDropper={false}
                                          format={'hex'}
                                          {...form.getInputProps(
                                            `categories.${categoryIndex}.waypoints.${
                                              waypointIndex +
                                              (currentPage - 1) * 10
                                            }.color`,
                                          )}
                                        />
                                        <Checkbox
                                          label={'Waypoint Enabled'}
                                          {...form.getInputProps(
                                            `categories.${categoryIndex}.waypoints.${
                                              waypointIndex +
                                              (currentPage - 1) * 10
                                            }.enabled`,
                                            {
                                              type: 'checkbox',
                                            },
                                          )}
                                        />
                                        <NumberInput
                                          label={'X'}
                                          {...form.getInputProps(
                                            `categories.${categoryIndex}.waypoints.${
                                              waypointIndex +
                                              (currentPage - 1) * 10
                                            }.x`,
                                          )}
                                        />
                                        <NumberInput
                                          label={'Y'}
                                          {...form.getInputProps(
                                            `categories.${categoryIndex}.waypoints.${
                                              waypointIndex +
                                              (currentPage - 1) * 10
                                            }.y`,
                                          )}
                                        />
                                        <NumberInput
                                          label={'Z'}
                                          {...form.getInputProps(
                                            `categories.${categoryIndex}.waypoints.${
                                              waypointIndex +
                                              (currentPage - 1) * 10
                                            }.z`,
                                          )}
                                        />
                                      </SimpleGrid>
                                    </Accordion.Panel>
                                  </Accordion.Item>
                                ))}
                              <Pagination
                                align={'center'}
                                mt={'1rem'}
                                total={Math.ceil(
                                  category.waypoints.length / 10,
                                )}
                                position={'center'}
                                value={currentPage}
                                onChange={(e) => setCurrentPage(e as number)}
                              />
                            </Accordion>
                          ))}
                      </Accordion.Panel>
                    </Accordion.Item>
                  );
                })}
              </Accordion>
              <Group position={'apart'} mt={'md'}>
                <Button onClick={() => setCreateNewCategoryModal(true)}>
                  New Category
                </Button>
                <Group>
                  <Button onClick={handleResetValues} variant={'outline'}>
                    Reset
                  </Button>
                  <Button type={'submit'}>Save Changes</Button>
                </Group>
              </Group>
            </form>
          </Paper>
        </>
      )}
    </div>
  );
}
