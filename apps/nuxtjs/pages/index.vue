<template>
  <div class="container mx-auto py-10">
    <h1 class="text-3xl font-bold mb-6">UI Components Test</h1>
    
    <div class="grid gap-8">
      <!-- Button Component Test -->
      <div class="p-6 border rounded-lg">
        <h2 class="text-xl font-semibold mb-4">Button Component</h2>
        <div class="flex flex-wrap gap-4">
          <Button>Default</Button>
          <Button variant="destructive">Destructive</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="link">Link</Button>
          <Button loading>Loading</Button>
        </div>
      </div>

      <!-- Card Component Test -->
      <div class="p-6 border rounded-lg">
        <h2 class="text-xl font-semibold mb-4">Card Component</h2>
        <Card>
          <template #header>
            <div class="p-6">
              <h3 class="text-lg font-medium">Card Header</h3>
            </div>
          </template>
          <div class="p-6">
            <p>Card Content</p>
          </div>
          <template #footer>
            <div class="p-6 border-t">
              <p class="text-sm text-gray-500">Card Footer</p>
            </div>
          </template>
        </Card>
      </div>

      <!-- Form Components Test -->
      <div class="p-6 border rounded-lg">
        <h2 class="text-xl font-semibold mb-4">Form Components</h2>
        <Form @submit.prevent class="space-y-4">
          <FormField>
            <Label>Email</Label>
            <Input type="email" placeholder="example@example.com" />
          </FormField>
          <FormField>
            <Label>Password</Label>
            <Input type="password" placeholder="Enter password" />
          </FormField>
          <Button type="submit">Submit</Button>
        </Form>
      </div>

      <!-- Table Component Test -->
      <div class="p-6 border rounded-lg">
        <h2 class="text-xl font-semibold mb-4">Table Component</h2>
        <div class="rounded-md border">
          <Table>
            <TableHeader>
              <tr>
                <th class="p-2">Name</th>
                <th class="p-2">Email</th>
                <th class="p-2">Role</th>
              </tr>
            </TableHeader>
            <TableBody>
              <tr class="border-t">
                <td class="p-2">John Doe</td>
                <td class="p-2">john@example.com</td>
                <td class="p-2">Admin</td>
              </tr>
              <tr class="border-t">
                <td class="p-2">Jane Smith</td>
                <td class="p-2">jane@example.com</td>
                <td class="p-2">User</td>
              </tr>
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Button from '~/components/ui/Button.vue'
import Card from '~/components/ui/Card.vue'
import Form from '~/components/ui/Form.vue'
import FormField from '~/components/ui/FormField.vue'
import Input from '~/components/ui/Input.vue'
import Label from '~/components/ui/Label.vue'
import Table from '~/components/ui/Table.vue'
import TableHeader from '~/components/ui/TableHeader.vue'
import TableBody from '~/components/ui/TableBody.vue'
</script>
