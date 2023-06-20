import { useState, useEffect } from 'react'
import { ScrollView, View, TouchableOpacity, Image, Text } from 'react-native'
import { useIsFocused } from '@react-navigation/native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Link, useRouter } from 'expo-router'
import Icon from '@expo/vector-icons/Feather'
import * as SecureStore from 'expo-secure-store'
import { Video, ResizeMode } from 'expo-av'

import NlwLogo from '../../src/assets/nlw-logo.svg'
import { api } from '../../src/lib/api'
import dayjs from 'dayjs'
import ptBr from 'dayjs/locale/pt-br'

interface MemoriesPreview {
  id: string
  cover_url: string
  excerpt: string
  created_at: string
}

export default function Memories() {
  const isFocused = useIsFocused()
  const [loadedMemoriesPreview, setLoadedMemoriesPreview] = useState<
    MemoriesPreview[]
  >([])
  const { bottom, top } = useSafeAreaInsets()
  const router = useRouter()

  const videoRegex = /\.(mp4|mov|avi|wmv|flv|mkv)$/

  async function handleLogout() {
    await SecureStore.deleteItemAsync('spacetimeToken')
    router.push('/')
  }

  useEffect(() => {
    ;(async () => {
      if (isFocused) {
        const token = await SecureStore.getItemAsync('spacetimeToken')
        const response = await api.get('/memories', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        setLoadedMemoriesPreview(response.data)
      }
    })()
  }, [isFocused])

  return (
    <ScrollView
      className="flex-1"
      contentContainerStyle={{ paddingBottom: bottom, paddingTop: top }}
    >
      <View className="mt-4 flex-row items-center justify-between px-8">
        <NlwLogo />

        <View className="flex-row gap-2">
          <TouchableOpacity
            className="h-10 w-10 items-center justify-center rounded-full bg-red-500"
            onPress={handleLogout}
          >
            <Icon name="log-out" size={16} color="#000" />
          </TouchableOpacity>
          <Link href="/memory/new" asChild>
            <TouchableOpacity className="h-10 w-10 items-center justify-center rounded-full bg-green-500">
              <Icon name="plus" size={16} color="#000" />
            </TouchableOpacity>
          </Link>
        </View>
      </View>

      <View className="space-y-10 py-6">
        {loadedMemoriesPreview.map((memory) => (
          <View key={memory.id} className="space-y-4">
            <View className="flex-row items-center gap-2">
              <View className="h-px w-5 bg-gray-50" />
              <Text className="font-body text-xs text-gray-100">
                {dayjs(memory.created_at)
                  .locale(ptBr)
                  .format('DD[ de ]MMMM[ de ]YYYY')}
              </Text>
            </View>

            <View className="space-y-4 px-8">
              {memory.cover_url ? (
                videoRegex.test(memory.cover_url) ? (
                  <Video
                    className="aspect-video w-full rounded-lg"
                    source={{ uri: memory.cover_url }}
                    resizeMode={ResizeMode.COVER}
                    useNativeControls
                  />
                ) : (
                  <Image
                    source={{ uri: memory.cover_url }}
                    alt=""
                    className="aspect-video w-full rounded-lg"
                  />
                )
              ) : null}
              <Text className="font-body text-base leading-relaxed text-gray-100">
                {memory.excerpt}
              </Text>
              <Link href={`/memory/${memory.id}`} asChild>
                <TouchableOpacity
                  className="flex-row items-center gap-2"
                  activeOpacity={0.7}
                >
                  <Text className="font-body text-sm text-gray-200">
                    Ler mais
                  </Text>
                  <Icon name="arrow-right" size={16} color="#9E9EA0" />
                </TouchableOpacity>
              </Link>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  )
}
