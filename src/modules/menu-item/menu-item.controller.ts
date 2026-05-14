import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { CreateMenuItemDto } from './dto/create-menu-item.dto';
import { UpdateMenuItemDto } from './dto/update-menu-item.dto';
import { MenuItemService } from './menu-item.service';

@ApiTags('menu-items')
@Controller({ path: 'menu-items', version: '1' })
export class MenuItemController {
  constructor(private readonly menuItemService: MenuItemService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Create a menu item' })
  create(@Body() createMenuItemDto: CreateMenuItemDto) {
    return this.menuItemService.create(createMenuItemDto);
  }

  @Get()
  @ApiOperation({ summary: 'List menu items' })
  @ApiQuery({ name: 'restaurantId', required: false })
  findAll(@Query() pagination: PaginationDto, @Query('restaurantId') restaurantId?: string) {
    return this.menuItemService.findAll(pagination, restaurantId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get menu item by ID' })
  @ApiParam({ name: 'id' })
  findOne(@Param('id') id: string) {
    return this.menuItemService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Update menu item' })
  update(@Param('id') id: string, @Body() updateMenuItemDto: UpdateMenuItemDto) {
    return this.menuItemService.update(id, updateMenuItemDto);
  }

}
